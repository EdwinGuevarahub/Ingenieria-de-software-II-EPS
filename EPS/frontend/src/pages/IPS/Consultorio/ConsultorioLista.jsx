// src/components/consultorios/ConsultorioFormulario.js
import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";

const ConsultorioFormulario = ({ initialData, onSubmit, onCancel }) => {
  const [consultorio, setConsultorio] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    idIps: "", // Podría ser un número
    cupsServicioMedico: "",
  });

  useEffect(() => {
    if (initialData) {
      setConsultorio({
        nombre: initialData.nombre || "",
        telefono: initialData.telefono || "",
        direccion: initialData.direccion || "",
        idIps: initialData.idIps || "",
        cupsServicioMedico: initialData.cupsServicioMedico || "",
        // Si el ID es parte del initialData para la actualización
        id: initialData.id || null,
      });
    } else {
      // Reset para formulario de creación
      setConsultorio({
        nombre: "",
        telefono: "",
        direccion: "",
        idIps: "",
        cupsServicioMedico: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsultorio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(consultorio);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        {initialData ? "Editar Consultorio" : "Crear Nuevo Consultorio"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre del Consultorio"
            name="nombre"
            value={consultorio.nombre}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Teléfono"
            name="telefono"
            value={consultorio.telefono}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Dirección"
            name="direccion"
            value={consultorio.direccion}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="ID de la IPS"
            name="idIps"
            type="number" // o text si es alfanumérico
            value={consultorio.idIps}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="CUPS del Servicio Médico"
            name="cupsServicioMedico"
            value={consultorio.cupsServicioMedico}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Actualizar" : "Crear"}
        </Button>
      </Box>
    </Box>
  );
};

export default ConsultorioFormulario;
