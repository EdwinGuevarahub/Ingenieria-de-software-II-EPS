-- Limpieza previa de tablas (en orden inverso para respetar restricciones)
TRUNCATE TABLE despacha, inventaria, ordena, detalle_formula, formula, genera, 
    agenda, trabaja, domina, pago_afiliacion, consultorio, adm_ips, 
    ips, paciente, medicamento, diagnostico, servicio_medico, medico, adm_eps CASCADE;

-- Reiniciar secuencia para ips.id_ips
SELECT setval('ips_id_ips_seq', (SELECT COALESCE(MAX(id_ips), 0) + 1 FROM ips), false);

-- Reiniciar secuencia para trabaja.id_trabaja
SELECT setval('trabaja_id_trabaja_seq', (SELECT COALESCE(MAX(id_trabaja), 0) + 1 FROM trabaja), false);

-- Reiniciar secuencia para agenda.id_agenda
SELECT setval('agenda_id_agenda_seq', (SELECT COALESCE(MAX(id_agenda), 0) + 1 FROM agenda), false);

-- Reiniciar secuencia para inventaria.id_inventaria
SELECT setval('inventaria_id_inventaria_seq', (SELECT COALESCE(MAX(id_inventaria), 0) + 1 FROM inventaria), false);

-- 1. Tabla adm_eps (administradores de EPS)
INSERT INTO adm_eps (email_admeps, nom_admeps, pass_admeps, tel_admeps) VALUES
('admin1@eps.com', 'Carlos Jiménez', 'c4r10sj1m3n3z', '3101234567'),
('admin2@eps.com', 'María Rodríguez', 'm4r14r0dr1gu3z', '3112345678'),
('admin3@eps.com', 'Juan García', 'ju4ng4rc14', '3123456789'),
('admin4@eps.com', 'Laura Martínez', 'l4ur4m4rt1n3z', '3134567890'),
('admin5@eps.com', 'Pedro López', 'p3dr0l0p3z', '3145678901');

-- 2. Tabla medico
INSERT INTO medico (dni_medico, nom_medico, email_medico, pass_medico, tel_medico, activo_medico) VALUES
(1001234567, 'Dr. Fernando Pérez', 'fernando.perez@medicos.com', 'f3rn4nd0', '3005551001', true),
(1002345678, 'Dra. Luisa Gómez', 'luisa.gomez@medicos.com', 'lu1s4g0m3z', '3005552002', true),
(1003456789, 'Dr. Santiago Rivera', 'santiago.rivera@medicos.com', 's4nt14g0', '3005553003', true),
(1004567890, 'Dra. Valentina Castro', 'valentina.castro@medicos.com', 'v4l3nt1n4', '3005554004', true),
(1005678901, 'Dr. Andrés Medina', 'andres.medina@medicos.com', '4ndr3s', '3005555005', false);

-- 3. Tabla servicio_medico
INSERT INTO servicio_medico (cups_sermed, nom_sermed, desc_sermed, tarifa_sermed) VALUES
('890201', 'Consulta Medicina General', 'Evaluación médica de primer nivel', 30000.00),
('890301', 'Consulta Especialista', 'Consulta con especialista', 60000.00),
('903810', 'Radiografía Tórax', 'Imagen diagnóstica de tórax PA y lateral', 45000.00),
('881234', 'Ecografía Abdominal', 'Ultrasonido completo de abdomen', 75000.00),
('541200', 'Terapia Física', 'Sesión de fisioterapia', 36000.00);

-- 4. Tabla diagnostico
INSERT INTO diagnostico (cie_diagnostico, nom_diagnostico, desc_diagnostico) VALUES
('A09', 'Diarrea y gastroenteritis', 'Infección intestinal'),
('I10', 'Hipertensión esencial', 'Presión arterial alta idiopática'),
('E11', 'Diabetes mellitus tipo 2', 'Diabetes no insulinodependiente'),
('J45', 'Asma', 'Enfermedad respiratoria caracterizada por broncoespasmos'),
('M54.5', 'Lumbago', 'Dolor en región lumbar');

-- 5. Tabla medicamento
INSERT INTO medicamento (id_medicamento, nom_medicamento) VALUES
('MED-001', 'Acetaminofén 500mg'),
('MED-002', 'Losartán 50mg'),
('MED-003', 'Metformina 850mg'),
('MED-004', 'Salbutamol Inhalador'),
('MED-005', 'Diclofenaco 50mg');

-- 6. Tabla paciente
INSERT INTO paciente (dni_paciente, beneficiario_paciente, nom_paciente, fnac_paciente, email_paciente, pass_paciente, tel_paciente, sexo_paciente, dir_paciente, admreg_paciente, fafili_paciente) VALUES
(2001234567, NULL, 'Ana María López', '1985-06-15', 'ana.lopez@email.com', 'an4l0p3z', '3152001001', 'F', 'Calle 45 #23-67', 'admin1@eps.com', '2022-01-15 08:30:00'),
(2002345678, NULL, 'Roberto Sánchez', '1978-11-22', 'roberto.sanchez@email.com', 'r0b3rt0', '3152002002', 'M', 'Carrera 67 #12-34', 'admin2@eps.com', '2022-02-20 10:15:00'),
(2003456789, 2001234567, 'Carmen López', '2010-03-30', 'carmen.lopez@email.com', 'c4rm3n', '3152003003', 'F', 'Calle 45 #23-67', 'admin1@eps.com', '2022-01-15 08:35:00'),
(2004567890, NULL, 'Diego Ramírez', '1990-07-18', 'diego.ramirez@email.com', 'd13g0', '3152004004', 'M', 'Avenida 34 #56-78', 'admin3@eps.com', '2022-03-10 14:20:00'),
(2005678901, 2002345678, 'Patricia Sánchez', '2015-09-05', 'patricia.sanchez@email.com', 'p4tr1c14', '3152005005', 'F', 'Carrera 67 #12-34', 'admin2@eps.com', '2022-02-20 10:20:00');

-- 7. Tabla ips
INSERT INTO ips (id_ips, nom_ips, dir_ips, tel_ips, admreg_ips, freg_ips) VALUES
(DEFAULT, 'Clínica del Norte', 'Calle 80 #56-23', '6042551001', 'admin1@eps.com', '2021-06-10 09:00:00'),
(DEFAULT, 'Centro Médico La Salud', 'Carrera 43 #12-67', '6042552002', 'admin2@eps.com', '2021-07-15 11:30:00'),
(DEFAULT, 'Hospital San Vicente', 'Avenida Oriental #45-12', '6042553003', 'admin3@eps.com', '2021-08-20 10:45:00'),
(DEFAULT, 'Clínica Las Américas', 'Calle 33 #80-23', '6042554004', 'admin4@eps.com', '2021-09-25 08:15:00'),
(DEFAULT, 'Centro de Especialistas', 'Carrera 65 #48-32', '6042555005', 'admin5@eps.com', '2021-10-30 13:20:00');

-- 8. Tabla adm_ips
INSERT INTO adm_ips (email_admips, ips_admips, nom_admips, pass_admips, tel_admips) VALUES
('admin_ips1@clinica.com', 1, 'Alejandro Restrepo', '4l3j4ndr0', '3182001001'),
('admin_ips2@clinica.com', 2, 'Natalia Vélez', 'n4t4l14', '3182002002'),
('admin_ips3@hospital.com', 3, 'Mauricio Duque', 'm4ur1c10', '3182003003'),
('admin_ips4@clinica.com', 4, 'Daniela Moreno', 'd4n13l4', '3182004004'),
('admin_ips5@centro.com', 5, 'Gabriel Ochoa', 'g4br13l', '3182005005');

-- 9. Tabla consultorio
INSERT INTO consultorio (ips_consultorio, id_consultorio, sermed_consultorio) VALUES
(1, 101, '890201'),
(1, 102, '890301'),
(2, 201, '890201'),
(2, 202, '903810'),
(3, 301, '881234'),
(3, 302, '541200'),
(4, 401, '890201'),
(4, 402, '890301'),
(5, 501, '890201'),
(5, 502, '881234');

-- 10. Tabla domina (relación médicos y servicios)
INSERT INTO domina (medico_domina, servicio_domina) VALUES
(1001234567, '890201'),
(1001234567, '890301'),
(1002345678, '890301'),
(1002345678, '881234'),
(1003456789, '890201'),
(1003456789, '903810'),
(1004567890, '890301'),
(1004567890, '541200'),
(1005678901, '890201'),
(1005678901, '881234');

-- 11. Tabla trabaja
INSERT INTO trabaja (id_trabaja, medico_trabaja, ips_trabaja, consultorio_trabaja, horario_trabaja) VALUES
(DEFAULT, 1001234567, 1, 101, 'L08-17,M08-17,X08-17,J08-17,V08-17,S00-00,D00-00'),
(DEFAULT, 1002345678, 1, 102, 'L08-17,M08-17,X08-17,J08-17,V08-17,S08-12,D00-00'),
(DEFAULT, 1003456789, 2, 201, 'L14-22,M14-22,X14-22,J14-22,V00-00,S00-00,D00-00'),
(DEFAULT, 1004567890, 3, 302, 'L08-17,M08-17,X08-17,J08-17,V08-17,S00-00,D00-00'),
(DEFAULT, 1005678901, 4, 401, 'L08-12,M08-12,X08-12,J08-12,V08-12,S00-00,D00-00');

-- 12. Tabla pago_afiliacion
INSERT INTO pago_afiliacion (paciente_pagoafiliacion, f_pagoafiliacion, tarifa_pagoafiliacion) VALUES
(2001234567, '2022-01-15 08:30:00', 150000.00),
(2001234567, '2022-02-15 09:15:00', 150000.00),
(2002345678, '2022-02-20 10:15:00', 150000.00),
(2002345678, '2022-03-20 11:30:00', 150000.00),
(2003456789, '2022-01-15 08:35:00', 75000.00),
(2004567890, '2022-03-10 14:20:00', 150000.00),
(2004567890, '2022-04-10 13:45:00', 150000.00),
(2005678901, '2022-02-20 10:20:00', 75000.00);

-- 13. Tabla agenda
INSERT INTO agenda (id_agenda, paciente_agenda, trabaja_agenda, f_agenda, fpago_agenda, resultado_agenda, estado_agenda) VALUES
(DEFAULT, 2001234567, 1, '2023-03-10 09:00:00', '2023-03-10 08:30:00', 'Paciente con síntomas de hipertensión. Se realiza control y ajuste de medicación.', 'completada'),
(DEFAULT, 2002345678, 2, '2023-03-15 10:30:00', '2023-03-15 10:00:00', 'Evaluación de dolor abdominal. Se solicita ecografía abdominal.', 'completada'),
(DEFAULT, 2003456789, 1, '2023-03-20 14:00:00', '2023-03-20 13:30:00', 'Control pediátrico rutinario. Desarrollo normal.', 'completada'),
(DEFAULT, 2004567890, 3, '2023-03-25 16:30:00', '2023-03-25 16:00:00', 'Paciente con síntomas de asma. Se ajusta tratamiento.', 'completada'),
(DEFAULT, 2005678901, 4, '2023-03-30 11:00:00', NULL, NULL, 'pendiente'),
(DEFAULT, 2001234567, 5, '2023-04-05 09:15:00', NULL, NULL, 'cancelada'),
(DEFAULT, 2002345678, 1, '2023-04-10 14:30:00', NULL, NULL, 'pendiente');

-- 14. Tabla genera
INSERT INTO genera (agenda_genera, diagnostico_genera, obs_genera) VALUES
(1, 'I10', 'Hipertensión en estadio 1. Presión 140/90 mmHg.'),
(2, 'A09', 'Posible gastroenteritis viral. Deshidratación leve.'),
(3, 'E11', 'Control rutinario. Niveles de glucosa normales.'),
(4, 'J45', 'Asma leve, parcialmente controlada.');

-- 15. Tabla formula
INSERT INTO formula (agenda_formula, diagnostico_formula, obs_formula) VALUES
(1, 'I10', 'Continuar tratamiento antihipertensivo. Control en 1 mes.'),
(2, 'A09', 'Dieta blanda. Hidratación abundante. Control en 5 días.'),
(3, 'E11', 'Mantener dieta y ejercicio. Ajuste menor en medicación.'),
(4, 'J45', 'Uso de inhalador según necesidad. Evitar alérgenos.');

-- 16. Tabla detalle_formula
INSERT INTO detalle_formula (agenda_detallef, diagnostico_detallef, id_detallef, medicamento_detallef, cantidad_detallef, dosis_detallef, duracion_detallef) VALUES
(1, 'I10', 1, 'MED-002', 30, '1 tableta cada 24 horas', '30 días'),
(2, 'A09', 1, 'MED-001', 12, '1 tableta cada 8 horas si hay dolor', '4 días'),
(3, 'E11', 1, 'MED-003', 60, '1 tableta cada 12 horas con las comidas', '30 días'),
(4, 'J45', 1, 'MED-004', 1, '2 inhalaciones cada 8 horas según necesidad', '30 días'),
(4, 'J45', 2, 'MED-005', 10, '1 tableta cada 12 horas si hay inflamación', '5 días');

-- 17. Tabla ordena
INSERT INTO ordena (agenda_ordena, servicio_ordena) VALUES
(1, '903810'),
(2, '881234'),
(3, '890201'),
(4, '541200');

-- 18. Tabla inventaria
INSERT INTO inventaria (id_inventaria, ips_inventaria, medicamento_inventaria, cantidad_inventaria) VALUES
(DEFAULT, 1, 'MED-001', 500),
(DEFAULT, 1, 'MED-002', 300),
(DEFAULT, 2, 'MED-001', 450),
(DEFAULT, 2, 'MED-003', 250),
(DEFAULT, 3, 'MED-002', 350),
(DEFAULT, 3, 'MED-004', 150),
(DEFAULT, 4, 'MED-003', 400),
(DEFAULT, 4, 'MED-005', 200),
(DEFAULT, 5, 'MED-004', 180),
(DEFAULT, 5, 'MED-005', 220);

-- 19. Tabla despacha
INSERT INTO despacha (paciente_despacha, inventaria_despacha, f_despacha) VALUES
(2001234567, 2, '2023-03-10 09:30:00'),
(2002345678, 1, '2023-03-15 11:00:00'),
(2003456789, 4, '2023-03-20 14:30:00'),
(2004567890, 6, '2023-03-25 17:00:00'),
(2001234567, 2, '2023-04-10 10:15:00');
