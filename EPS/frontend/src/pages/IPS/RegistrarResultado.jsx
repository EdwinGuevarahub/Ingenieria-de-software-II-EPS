import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// Lista de medicamentos para el ejemplo
const MEDICAMENTOS = [
  "Acetaminofén 500mg",
  "Ibuprofeno 400mg",
  "Omeprazol 20mg",
  "Amoxicilina 500mg",
  "Loratadina 10mg",
  "Metformina 850mg",
  "Enalapril 10mg",
  "Losartán 50mg",
  "Diclofenaco 50mg",
  "Ranitidina 150mg",
];

// Lista de especialidades médicas
const ESPECIALIDADES = [
  "Cardiología",
  "Dermatología",
  "Gastroenterología",
  "Neurología",
  "Oftalmología",
  "Oncología",
  "Pediatría",
  "Psiquiatría",
  "Traumatología",
  "Urología",
];

// Tipos de órdenes médicas
const TIPOS_ORDEN = ["Fórmula médica", "Remisión", "Toma de exámenes"];

function MedicalOrderForm() {
  const [documentId, setDocumentId] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tipoOrden, setTipoOrden] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Campos para Fórmula médica
  const [observacionesFormula, setObservacionesFormula] = useState("");
  const [medicamentos, setMedicamentos] = useState([
    { medicamento: "", receta: "" },
  ]);

  // Campos para Remisión/Toma de exámenes
  const [especialidad, setEspecialidad] = useState("");
  const [observacionesRemision, setObservacionesRemision] = useState("");

  const handleSubmitId = (event) => {
    event.preventDefault();
    setShowOrderForm(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setShowOrderForm(true);
    }
  };

  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { medicamento: "", receta: "" }]);
  };

  const handleRemoveMedicamento = (index) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos.splice(index, 1);
    setMedicamentos(newMedicamentos);
  };

  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;
    setMedicamentos(newMedicamentos);
  };

  const renderFormulaMedica = () => (
    <Box sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Observaciones de la fórmula"
        variant="outlined"
        multiline
        rows={3}
        value={observacionesFormula}
        onChange={(e) => setObservacionesFormula(e.target.value)}
        margin="normal"
      />

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Medicamentos
      </Typography>

      {medicamentos.map((med, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={4} item xs={12} md={5}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Medicamento {index + 1}</InputLabel>
                <Select
                  value={med.medicamento}
                  label={`Medicamento ${index + 1}`}
                  onChange={(e) =>
                    handleMedicamentoChange(
                      index,
                      "medicamento",
                      e.target.value,
                    )
                  }
                >
                  {MEDICAMENTOS.map((med) => (
                    <MenuItem key={med} value={med}>
                      {med}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={7} item xs={12} md={6}>
              <TextField
                fullWidth
                label="Posología/Receta"
                variant="outlined"
                multiline
                rows={2}
                value={med.receta}
                onChange={(e) =>
                  handleMedicamentoChange(index, "receta", e.target.value)
                }
                margin="normal"
                placeholder="Ej: 1 tableta cada 8 horas por 7 días"
              />
            </Grid>
            <Grid
              size={1}
              item
              xs={12}
              md={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3,
              }}
            >
              {index > 0 && (
                <IconButton
                  onClick={() => handleRemoveMedicamento(index)}
                  color="error"
                  size="large"
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
          {index < medicamentos.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}

      <Button
        startIcon={<AddCircleOutlineOutlinedIcon />}
        onClick={handleAddMedicamento}
        sx={{ mt: 2 }}
        variant="outlined"
      >
        Agregar medicamento
      </Button>
    </Box>
  );

  const renderRemisionExamenes = () => (
    <Box sx={{ mt: 3 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Especialidad</InputLabel>
        <Select
          value={especialidad}
          label="Especialidad"
          onChange={(e) => setEspecialidad(e.target.value)}
        >
          {ESPECIALIDADES.map((esp) => (
            <MenuItem key={esp} value={esp}>
              {esp}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Observaciones"
        variant="outlined"
        multiline
        rows={4}
        value={observacionesRemision}
        onChange={(e) => setObservacionesRemision(e.target.value)}
        margin="normal"
      />
    </Box>
  );

  return (
    <Container className="my-component" maxWidth="md">
      <Typography
        sx={{ fontWeight: "bold" }}
        align="center"
        variant="h1"
        component="h1"
        gutterBottom
      >
        Sistema de Órdenes Médicas
      </Typography>

      {!showOrderForm ? (
        <Box component="form" onSubmit={handleSubmitId} noValidate>
          <TextField
            fullWidth
            label="Documento de Identificación del Paciente"
            variant="outlined"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            onKeyDown={handleKeyDown}
            margin="normal"
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="contained"
            maxWidth="sm"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#CC5C52",
              "&:hover": {
                bgcolor: "#DF6E0B",
              },
            }}
          >
            Verificar
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Paciente ID: <strong>{documentId}</strong>
          </Typography>

          <TextField
            fullWidth
            label="Diagnóstico"
            variant="outlined"
            multiline
            rows={4}
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Orden</InputLabel>
            <Select
              value={tipoOrden}
              label="Tipo de Orden"
              onChange={(e) => setTipoOrden(e.target.value)}
            >
              {TIPOS_ORDEN.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {tipoOrden === "Fórmula médica" && renderFormulaMedica()}
          {(tipoOrden === "Remisión" || tipoOrden === "Toma de exámenes") &&
            renderRemisionExamenes()}

          {tipoOrden && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 4,
                mb: 2,
                bgcolor: "#4CAF50",
                "&:hover": {
                  bgcolor: "#388E3C",
                },
              }}
            >
              Guardar Orden Médica
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}

export default MedicalOrderForm;
