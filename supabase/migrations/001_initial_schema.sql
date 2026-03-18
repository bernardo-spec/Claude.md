-- ============================================================================
-- 001_initial_schema.sql
-- CRM "Coders" - Brazilian Dev Career Acceleration Program
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- profiles
CREATE TABLE public.profiles (
    id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   text        NOT NULL,
    email       text        NOT NULL,
    role        text        NOT NULL DEFAULT 'membro'
                            CHECK (role IN ('admin', 'membro')),
    avatar_url  text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- pipeline_stages
CREATE TABLE public.pipeline_stages (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            text        NOT NULL,
    slug            text        NOT NULL UNIQUE,
    position        integer     NOT NULL UNIQUE,
    color           text,
    is_closed_won   boolean     NOT NULL DEFAULT false,
    is_closed_lost  boolean     NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- leads
CREATE TABLE public.leads (
    id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    nome              text          NOT NULL,
    email             text,
    telefone          text,
    origem            text,
    senioridade       text          CHECK (senioridade IN ('junior', 'pleno', 'senior', 'tech_lead', 'arquiteto', 'cto')),
    stack_principal   text,
    nivel_ingles      text          CHECK (nivel_ingles IN ('basico', 'intermediario', 'avancado', 'fluente')),
    plano_interesse   text          CHECK (plano_interesse IN ('1.0', '2.0')),
    notas             text,
    stage_id          uuid          NOT NULL REFERENCES public.pipeline_stages(id),
    position_in_stage integer       NOT NULL DEFAULT 0,
    assigned_to       uuid          REFERENCES public.profiles(id),
    valor_estimado    numeric(10,2),
    motivo_perda      text,
    created_at        timestamptz   NOT NULL DEFAULT now(),
    updated_at        timestamptz   NOT NULL DEFAULT now()
);

-- lead_activities
CREATE TABLE public.lead_activities (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id     uuid        NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    user_id     uuid        NOT NULL REFERENCES public.profiles(id),
    type        text        NOT NULL
                            CHECK (type IN ('note', 'call', 'email', 'whatsapp', 'meeting', 'stage_change', 'system')),
    content     text        NOT NULL,
    metadata    jsonb,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- integration_events
CREATE TABLE public.integration_events (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type    text        NOT NULL,
    payload       jsonb       NOT NULL,
    status        text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'processing', 'delivered', 'failed')),
    target        text        NOT NULL,
    error         text,
    attempts      integer     NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT now(),
    processed_at  timestamptz
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_leads_stage_id       ON public.leads (stage_id, position_in_stage);
CREATE INDEX idx_leads_assigned_to    ON public.leads (assigned_to);
CREATE INDEX idx_leads_email          ON public.leads (email);
CREATE INDEX idx_leads_created_at     ON public.leads (created_at DESC);

CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities (lead_id, created_at DESC);

CREATE INDEX idx_integration_events_status ON public.integration_events (status, created_at)
    WHERE status = 'pending';

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- 1. Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Auto-create profile when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        NEW.email,
        'membro',
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 3. Log stage changes to lead_activities and integration_events
CREATE OR REPLACE FUNCTION public.log_stage_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id uuid;
    _old_stage_name text;
    _new_stage_name text;
BEGIN
    IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
        -- Determine acting user (fallback to assigned_to if no auth context)
        _user_id := COALESCE(auth.uid(), NEW.assigned_to);

        SELECT name INTO _old_stage_name FROM public.pipeline_stages WHERE id = OLD.stage_id;
        SELECT name INTO _new_stage_name FROM public.pipeline_stages WHERE id = NEW.stage_id;

        -- Insert activity log
        INSERT INTO public.lead_activities (lead_id, user_id, type, content, metadata)
        VALUES (
            NEW.id,
            _user_id,
            'stage_change',
            'Lead movido de "' || _old_stage_name || '" para "' || _new_stage_name || '"',
            jsonb_build_object(
                'old_stage_id', OLD.stage_id,
                'new_stage_id', NEW.stage_id,
                'old_stage_name', _old_stage_name,
                'new_stage_name', _new_stage_name
            )
        );

        -- Insert integration event
        INSERT INTO public.integration_events (event_type, payload, status, target)
        VALUES (
            'lead.stage_changed',
            jsonb_build_object(
                'lead_id', NEW.id,
                'lead_nome', NEW.nome,
                'lead_email', NEW.email,
                'old_stage_id', OLD.stage_id,
                'new_stage_id', NEW.stage_id,
                'old_stage_name', _old_stage_name,
                'new_stage_name', _new_stage_name,
                'changed_by', _user_id
            ),
            'pending',
            'webhook'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_stage_change
    AFTER UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.log_stage_change();

-- ============================================================================
-- HELPER FUNCTION: auth.user_role()
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_events ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----

CREATE POLICY "profiles_select_authenticated"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "profiles_update_own_or_admin"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        id = auth.uid() OR auth.user_role() = 'admin'
    )
    WITH CHECK (
        id = auth.uid() OR auth.user_role() = 'admin'
    );

-- ---- pipeline_stages ----

CREATE POLICY "pipeline_stages_select_authenticated"
    ON public.pipeline_stages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "pipeline_stages_insert_admin"
    ON public.pipeline_stages FOR INSERT
    TO authenticated
    WITH CHECK (auth.user_role() = 'admin');

CREATE POLICY "pipeline_stages_update_admin"
    ON public.pipeline_stages FOR UPDATE
    TO authenticated
    USING (auth.user_role() = 'admin')
    WITH CHECK (auth.user_role() = 'admin');

CREATE POLICY "pipeline_stages_delete_admin"
    ON public.pipeline_stages FOR DELETE
    TO authenticated
    USING (auth.user_role() = 'admin');

-- ---- leads ----

CREATE POLICY "leads_all_authenticated"
    ON public.leads FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ---- lead_activities ----

CREATE POLICY "lead_activities_select_authenticated"
    ON public.lead_activities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "lead_activities_insert_authenticated"
    ON public.lead_activities FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "lead_activities_update_own_or_admin"
    ON public.lead_activities FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid() OR auth.user_role() = 'admin'
    )
    WITH CHECK (
        user_id = auth.uid() OR auth.user_role() = 'admin'
    );

-- ---- integration_events ----

CREATE POLICY "integration_events_select_admin"
    ON public.integration_events FOR SELECT
    TO authenticated
    USING (auth.user_role() = 'admin');

-- ============================================================================
-- SEED DATA: pipeline_stages
-- ============================================================================

INSERT INTO public.pipeline_stages (position, name, slug, color, is_closed_won, is_closed_lost) VALUES
    (0, 'Lead Novo',          'lead-novo',          '#6366f1', false, false),
    (1, 'Primeiro Contato',   'primeiro-contato',   '#8b5cf6', false, false),
    (2, 'Reunião Agendada',   'reuniao-agendada',   '#a855f7', false, false),
    (3, 'Reunião Realizada',  'reuniao-realizada',  '#d946ef', false, false),
    (4, 'Proposta Enviada',   'proposta-enviada',   '#ec4899', false, false),
    (5, 'Follow-up',          'follow-up',          '#f97316', false, false),
    (6, 'Fechado Ganho',      'fechado-ganho',      '#22c55e', true,  false),
    (7, 'Fechado Perdido',    'fechado-perdido',    '#ef4444', false, true);
