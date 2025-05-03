CREATE TABLE "paciente" (
  "dni_paciente" bigint PRIMARY KEY,
  "beneficiario_paciente" bigint,
  "nom_paciente" varchar(80) NOT NULL,
  "fnac_paciente" date NOT NULL,
  "email_paciente" varchar(255) UNIQUE NOT NULL,
  "pass_paciente" char(256) NOT NULL,
  "tel_paciente" varchar(20) NOT NULL,
  "sexo_paciente" char(1) NOT NULL,
  "dir_paciente" varchar(255) NOT NULL,
  "admreg_paciente" varchar(255) NOT NULL,
  "fafili_paciente" timestamp NOT NULL
);

CREATE TABLE "adm_eps" (
  "email_admeps" varchar(255) PRIMARY KEY,
  "nom_admeps" varchar(80) NOT NULL,
  "pass_admeps" char(256) NOT NULL,
  "tel_admeps" varchar(20) NOT NULL
);

CREATE TABLE "adm_ips" (
  "email_admips" varchar(255) PRIMARY KEY,
  "ips_admips" integer NOT NULL,
  "nom_admips" varchar(80) NOT NULL,
  "pass_admips" char(256) NOT NULL,
  "tel_admips" varchar(20) NOT NULL
);

CREATE TABLE "medico" (
  "dni_medico" bigint PRIMARY KEY,
  "nom_medico" varchar(80) NOT NULL,
  "email_medico" varchar(255) UNIQUE NOT NULL,
  "pass_medico" char(256) NOT NULL,
  "tel_medico" varchar(20) NOT NULL,
  "activo_medico" boolean NOT NULL DEFAULT true
);

CREATE TABLE "ips" (
  "id_ips" serial PRIMARY KEY,
  "nom_ips" varchar(200) NOT NULL,
  "dir_ips" varchar(255) NOT NULL,
  "tel_ips" varchar(20) NOT NULL,
  "admreg_ips" varchar(255) NOT NULL,
  "freg_ips" timestamp NOT NULL
);

CREATE TABLE "consultorio" (
  "ips_consultorio" integer,
  "id_consultorio" integer,
  "sermed_consultorio" varchar(10) NOT NULL,
  PRIMARY KEY ("ips_consultorio", "id_consultorio")
);

CREATE TABLE "servicio_medico" (
  "cups_sermed" varchar(10) PRIMARY KEY,
  "nom_sermed" varchar(100) NOT NULL,
  "desc_sermed" text,
  "tarifa_sermed" numeric(10,2) NOT NULL
);

CREATE TABLE "diagnostico" (
  "cie_diagnostico" varchar(10) PRIMARY KEY,
  "nom_diagnostico" varchar(255) NOT NULL,
  "desc_diagnostico" text
);

CREATE TABLE "medicamento" (
  "id_medicamento" varchar(20) PRIMARY KEY,
  "nom_medicamento" varchar(100) NOT NULL
);

CREATE TABLE "pago_afiliacion" (
  "paciente_pagoafiliacion" bigint,
  "f_pagoafiliacion" timestamp,
  "tarifa_pagoafiliacion" numeric(10,2) NOT NULL,
  PRIMARY KEY ("paciente_pagoafiliacion", "f_pagoafiliacion")
);

CREATE TABLE "domina" (
  "medico_domina" bigint,
  "servicio_domina" varchar(10),
  PRIMARY KEY ("medico_domina", "servicio_domina")
);

CREATE TABLE "trabaja" (
  "id_trabaja" serial PRIMARY KEY,
  "medico_trabaja" bigint NOT NULL,
  "ips_trabaja" integer NOT NULL,
  "consultorio_trabaja" integer NOT NULL,
  "horario_trabaja" varchar(48) NOT NULL
);

CREATE TABLE "agenda" (
  "id_agenda" serial PRIMARY KEY,
  "paciente_agenda" bigint NOT NULL,
  "trabaja_agenda" integer NOT NULL,
  "f_agenda" timestamp NOT NULL,
  "fpago_agenda" timestamp,
  "resultado_agenda" text,
  "estado_agenda" varchar(20) NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE "genera" (
  "agenda_genera" integer,
  "diagnostico_genera" varchar(10),
  "obs_genera" text,
  PRIMARY KEY ("agenda_genera", "diagnostico_genera")
);

CREATE TABLE "formula" (
  "agenda_formula" integer,
  "diagnostico_formula" varchar(10),
  "obs_formula" text,
  PRIMARY KEY ("agenda_formula", "diagnostico_formula")
);

CREATE TABLE "detalle_formula" (
  "agenda_detallef" integer,
  "diagnostico_detallef" varchar(10),
  "id_detallef" integer,
  "medicamento_detallef" varchar(20) NOT NULL,
  "cantidad_detallef" integer NOT NULL,
  "dosis_detallef" varchar(100) NOT NULL,
  "duracion_detallef" varchar(100) NOT NULL,
  PRIMARY KEY ("agenda_detallef", "diagnostico_detallef", "id_detallef")
);

CREATE TABLE "ordena" (
  "agenda_ordena" integer,
  "servicio_ordena" varchar(10),
  PRIMARY KEY ("agenda_ordena", "servicio_ordena")
);

CREATE TABLE "inventaria" (
  "id_inventaria" serial PRIMARY KEY,
  "ips_inventaria" integer NOT NULL,
  "medicamento_inventaria" varchar(20) NOT NULL,
  "cantidad_inventaria" integer NOT NULL DEFAULT 0
);

CREATE TABLE "despacha" (
  "paciente_despacha" bigint,
  "inventaria_despacha" integer,
  "f_despacha" timestamp,
  PRIMARY KEY ("paciente_despacha", "inventaria_despacha", "f_despacha")
);

CREATE UNIQUE INDEX ON "trabaja" ("ips_trabaja", "consultorio_trabaja");

CREATE UNIQUE INDEX ON "inventaria" ("ips_inventaria", "medicamento_inventaria");

COMMENT ON COLUMN "trabaja"."horario_trabaja" IS 'L00-23,M00-23,R00-23,J00-23,V00-23,S00-23,D00-23';

COMMENT ON COLUMN "agenda"."estado_agenda" IS 'pendiente, completada, cancelada';

ALTER TABLE "paciente" ADD FOREIGN KEY ("beneficiario_paciente") REFERENCES "paciente" ("dni_paciente");

ALTER TABLE "paciente" ADD FOREIGN KEY ("admreg_paciente") REFERENCES "adm_eps" ("email_admeps");

ALTER TABLE "adm_ips" ADD FOREIGN KEY ("ips_admips") REFERENCES "ips" ("id_ips");

ALTER TABLE "ips" ADD FOREIGN KEY ("admreg_ips") REFERENCES "adm_eps" ("email_admeps");

ALTER TABLE "consultorio" ADD FOREIGN KEY ("ips_consultorio") REFERENCES "ips" ("id_ips");

ALTER TABLE "consultorio" ADD FOREIGN KEY ("sermed_consultorio") REFERENCES "servicio_medico" ("cups_sermed");

ALTER TABLE "pago_afiliacion" ADD FOREIGN KEY ("paciente_pagoafiliacion") REFERENCES "paciente" ("dni_paciente");

ALTER TABLE "domina" ADD FOREIGN KEY ("medico_domina") REFERENCES "medico" ("dni_medico");

ALTER TABLE "domina" ADD FOREIGN KEY ("servicio_domina") REFERENCES "servicio_medico" ("cups_sermed");

ALTER TABLE "trabaja" ADD FOREIGN KEY ("medico_trabaja") REFERENCES "medico" ("dni_medico");

ALTER TABLE "trabaja" ADD FOREIGN KEY ("ips_trabaja", "consultorio_trabaja") REFERENCES "consultorio" ("ips_consultorio", "id_consultorio");

ALTER TABLE "agenda" ADD FOREIGN KEY ("paciente_agenda") REFERENCES "paciente" ("dni_paciente");

ALTER TABLE "agenda" ADD FOREIGN KEY ("trabaja_agenda") REFERENCES "trabaja" ("id_trabaja");

ALTER TABLE "genera" ADD FOREIGN KEY ("agenda_genera") REFERENCES "agenda" ("id_agenda");

ALTER TABLE "genera" ADD FOREIGN KEY ("diagnostico_genera") REFERENCES "diagnostico" ("cie_diagnostico");

ALTER TABLE "formula" ADD FOREIGN KEY ("agenda_formula", "diagnostico_formula") REFERENCES "genera" ("agenda_genera", "diagnostico_genera");

ALTER TABLE "detalle_formula" ADD FOREIGN KEY ("medicamento_detallef") REFERENCES "medicamento" ("id_medicamento");

ALTER TABLE "detalle_formula" ADD FOREIGN KEY ("agenda_detallef", "diagnostico_detallef") REFERENCES "formula" ("agenda_formula", "diagnostico_formula");

ALTER TABLE "ordena" ADD FOREIGN KEY ("agenda_ordena") REFERENCES "agenda" ("id_agenda");

ALTER TABLE "ordena" ADD FOREIGN KEY ("servicio_ordena") REFERENCES "servicio_medico" ("cups_sermed");

ALTER TABLE "inventaria" ADD FOREIGN KEY ("ips_inventaria") REFERENCES "ips" ("id_ips");

ALTER TABLE "inventaria" ADD FOREIGN KEY ("medicamento_inventaria") REFERENCES "medicamento" ("id_medicamento");

ALTER TABLE "despacha" ADD FOREIGN KEY ("paciente_despacha") REFERENCES "paciente" ("dni_paciente");

ALTER TABLE "despacha" ADD FOREIGN KEY ("inventaria_despacha") REFERENCES "inventaria" ("id_inventaria");
