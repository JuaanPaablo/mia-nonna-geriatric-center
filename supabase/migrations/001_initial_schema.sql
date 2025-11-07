-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'staff');
CREATE TYPE patient_status AS ENUM ('active', 'inactive', 'discharged');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE care_type AS ENUM ('full_time', 'day_care', 'respite');
CREATE TYPE enrollment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'converted');

-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Patients table
CREATE TABLE public.patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type NOT NULL,
    medical_conditions TEXT[] DEFAULT '{}',
    emergency_contact JSONB NOT NULL,
    admission_date DATE NOT NULL,
    status patient_status DEFAULT 'active',
    room_number VARCHAR(10),
    care_plan TEXT,
    allergies TEXT[] DEFAULT '{}',
    medications JSONB[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enrollments table
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    enrollment_date DATE NOT NULL,
    care_type care_type NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    status enrollment_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Contact forms table
CREATE TABLE public.contact_forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    family_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    resident_name VARCHAR(100) NOT NULL,
    resident_age INTEGER NOT NULL CHECK (resident_age >= 0 AND resident_age <= 150),
    care_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status contact_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Services table
CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    featured BOOLEAN DEFAULT false,
    price DECIMAL(10,2),
    duration VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_patients_status ON public.patients(status);
CREATE INDEX idx_patients_admission_date ON public.patients(admission_date);
CREATE INDEX idx_patients_full_name ON public.patients USING gin(full_name gin_trgm_ops);
CREATE INDEX idx_enrollments_patient_id ON public.enrollments(patient_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_contact_forms_status ON public.contact_forms(status);
CREATE INDEX idx_contact_forms_created_at ON public.contact_forms(created_at);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_featured ON public.services(featured);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_patients
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_enrollments
    BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_contact_forms
    BEFORE UPDATE ON public.contact_forms
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_services
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Patients policies
CREATE POLICY "Authenticated users can view patients" ON public.patients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can create patients" ON public.patients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update patients" ON public.patients
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete patients" ON public.patients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Enrollments policies
CREATE POLICY "Authenticated users can view enrollments" ON public.enrollments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage enrollments" ON public.enrollments
    FOR ALL USING (auth.role() = 'authenticated');

-- Contact forms policies
CREATE POLICY "Anyone can create contact forms" ON public.contact_forms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact forms" ON public.contact_forms
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can update contact forms" ON public.contact_forms
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contact forms" ON public.contact_forms
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Services policies
CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant specific permissions for contact forms to anonymous users
GRANT INSERT ON public.contact_forms TO anon;

-- Create view for dashboard statistics
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM public.patients) AS total_patients,
    (SELECT COUNT(*) FROM public.patients WHERE status = 'active') AS active_patients,
    (SELECT COUNT(*) FROM public.enrollments WHERE status = 'pending') AS pending_enrollments,
    (SELECT COUNT(*) FROM public.contact_forms WHERE status = 'new') AS new_contacts,
    (SELECT COALESCE(SUM(monthly_fee), 0) FROM public.enrollments WHERE status = 'approved') AS monthly_revenue,
    (SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE status = 'active')::DECIMAL / COUNT(*)) * 100, 1)
            ELSE 0 
        END 
     FROM public.patients) AS occupancy_rate;

-- Grant access to the view
GRANT SELECT ON public.dashboard_stats TO authenticated;
