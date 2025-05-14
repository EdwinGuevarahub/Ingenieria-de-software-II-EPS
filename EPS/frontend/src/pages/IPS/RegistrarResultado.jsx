import { useState } from "react";
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
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  obtenerPacienteCitas,
  obtenerDiagnosticos,
  obtenerMedicamentos,
  obtenerServiciosMedicos
} from "../../services/resultadosService";

// Tipos de órdenes médicas
const TIPOS_ORDEN = ["Fórmula médica", "Remisión", "Toma de exámenes"];

function MedicalOrderForm() {
  const [dniPaciente, setDniPaciente] = useState("");
  const [idAgenda, setIdAgenda] = useState("");
  const [resultadoGeneral, setResultadoGeneral] = useState("");
  const [tipoOrden, setTipoOrden] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [obsDiagnostico, setObsDiagnostico] = useState("");
  const [medicamentos, setMedicamentos] = useState([
    { medicamento: "", receta: "" },
  ]);
   const [servicioMedico, setServicioMedico] = useState("");
  
  const [pacienteCitas, setPacienteCitas] = useState([]);
  const [listaDiagnosticos, setListaDiagnosticos] = useState([]);
  const [listaMedicamentos, setListaMedicamentos] = useState([]);
  const [listaServicios, setListaServicios] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [dniError, setDniError] = useState(false);
  const [dniErrorMensaje, setDniErrorMensaje] = useState("");
  const [loadingFechas, setLoadingFechas] = useState(false);

  // Campos para Remisión/Toma de exámenes
  // const [observacionesRemision, setObservacionesRemision] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loadingFechas) {
      event.preventDefault();
      handleSubmitId(event);
    }
  };

  // Al ingresar el DNI del pacinte
  const handleSubmitId = async (event) => {
    event.preventDefault();

    if (!dniPaciente.trim()) {
      setDniError(true);
      setDniErrorMensaje("Por favor digite el documento del paciente");
      return;
    }

    setDniError(false);

    try {
      setLoadingFechas(true);
      const { data } = await obtenerPacienteCitas(dniPaciente);
      const { paciente, citasPendientes } = data?.data;

      if (paciente && citasPendientes?.length > 0) {
        setPacienteCitas(data?.data);
        setShowOrderForm(true);
      } else {
        setDniError(true);
        setDniErrorMensaje("El paciente no tiene citas pendientes");
      }
    } catch (error) {
      setDniError(true);
      setDniErrorMensaje("El paciente no esta registrado");
    } finally {
      setLoadingFechas(false);
    }
  };

  // Obtener la lista de Diagnosticos
  const handleDiags = async () => {
    try {
      const { data: resDiagnosticos } = await obtenerDiagnosticos();

      if (Array.isArray(resDiagnosticos) && resDiagnosticos.length > 0) {
        setListaDiagnosticos(resDiagnosticos);
      } else {
        console.log("No se pudieron obtener los diagnósticos");
      }
    } catch (error) {
      console.log("No se pudieron obtener los diagnósticos");
    }
  };

  // Obtener lista de me Medicamentos
  const handleMedicamentos = async () => {
    try {
      const { data: listaMedicamentos } = await obtenerMedicamentos();

      if (Array.isArray(listaMedicamentos) && listaMedicamentos.length > 0) {
        setListaMedicamentos(listaMedicamentos);
      } else {
        console.warn("No se pudieron obtener los medicamentos");
      }
    } catch (error) {
      console.error("Error al obtener los medicamentos:", error);
    }
  };

  // Obtener lista de me servicios medicos
  const handleServiciosMedicos = async () => {
    try {
      const { data: listaServicios } = await obtenerServiciosMedicos();

      if (Array.isArray(listaServicios) && listaServicios.length > 0) {
        setListaServicios(listaServicios);
      } else {
        console.warn("No se pudieron obtener los servicios medicos");
      }
    } catch (error) {
      console.error("Error al obtener los servicios medicos:", error);
    }
  };

  // Añadir un nuevo medicamento para el diangnostico (interfaz)
  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { medicamento: "", receta: "" }]);
  };

  // Eliminar un medicamento del diangnostico (interfaz)
  const handleRemoveMedicamento = (index) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos.splice(index, 1);
    setMedicamentos(newMedicamentos);
  };

  // Asignar el medicamento seleccionado de la lista desplegable
  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;
    setMedicamentos(newMedicamentos);
  };

  // Guardar el Resultado (General, diagnostico y medicamentos u Ordenes)
  const handleGuardarResultado = () => {
    const medicamentosFormateados = medicamentos.map((med) => {
      const medicamentoSeleccionado = listaMedicamentos.find(
        (medicamento) => medicamento.nombre === med.medicamento
      );
      const medicamentoId = medicamentoSeleccionado?.id || "";

      return {
        medicamento: {
          id: medicamentoId,
          nombre: med.medicamento,
        },
        cantidad: 0, // Valor por defecto
        dosis: med.receta || "",
        duracion: "", // Valor por defecto
      };
    });

    const resultadoJSON = {
      agendaId: parseInt(idAgenda) || null,
      resultadoAgenda: resultadoGeneral || null,
      diagnostico: diagnostico || null,
      observacion: obsDiagnostico || null,
      medicamentos: medicamentosFormateados,
    };

    // Imprimir el resultado en consola
    console.log(JSON.stringify(resultadoJSON, null, 2));
  };

  const renderFormulaMedica = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Diagnóstico
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={5} item xs={12} md={5}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Diagnóstico</InputLabel>
              <Select
                value={diagnostico}
                label={"Diagnóstico"}
                onChange={(e) => setDiagnostico(e.target.value)}
              >
                {listaDiagnosticos.map((diag) => (
                  <MenuItem key={diag.cie} value={diag.cie}>
                    {diag.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={7} item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones del Diagnóstico"
              variant="outlined"
              multiline
              rows={2}
              value={obsDiagnostico}
              onChange={(e) => setObsDiagnostico(e.target.value)}
              margin="normal"
              placeholder="Ej: Asma leve, parcialmente controlada."
            />
          </Grid>
        </Grid>
      </Box>

      {/* Apartado de medicamentos */}
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
                      e.target.value
                    )
                  }
                >
                  {listaMedicamentos.map((medicamento) => (
                    <MenuItem key={medicamento.id} value={medicamento.nombre}>
                      {medicamento.nombre}
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
          value={servicioMedico}
          label="Especialidad"
          onChange={(e) => setServicioMedico(e.target.value)}
        >
          {listaServicios.map((servicio) => (
            <MenuItem key={servicio.cups} value={servicio.cups}>
              {servicio.nombre} - {servicio.descripcion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <TextField
        fullWidth
        label="Observaciones"
        variant="outlined"
        multiline
        rows={4}
        value={observacionesRemision}
        onChange={(e) => setObservacionesRemision(e.target.value)}
        margin="normal"
      /> */}
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
        Sistema de Resultados Médicos
      </Typography>

      {!showOrderForm ? (
        <Box component="form" onSubmit={handleSubmitId} noValidate>
          <TextField
            fullWidth
            label="Documento Nacional de Identidad del paciente"
            type="number"
            variant="outlined"
            value={dniPaciente}
            onChange={(e) => setDniPaciente(e.target.value)}
            onKeyDown={handleKeyDown}
            margin="normal"
            required
            autoFocus
            disabled={loadingFechas}
          />
          {dniError && (
            <FormHelperText
              sx={{ display: "flex", alignItems: "center", color: "#e57373" }}
            >
              <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
              {dniErrorMensaje}
            </FormHelperText>
          )}

          <Button
            type="submit"
            variant="contained"
            maxWidth="sm"
            disabled={loadingFechas}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#CC5C52",
              "&:hover": {
                bgcolor: "#DF6E0B",
              },
            }}
          >
            {loadingFechas ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                Buscando...
              </>
            ) : (
              "Verificar"
            )}
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderLeft: "4px solid #0a87be",
              // backgroundColor: '#fafafa',
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, color: "#0a87be", mb: 1 }}
            >
              Información del Paciente
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <span style={{ color: "#666" }}>Nombre:</span>{" "}
                  {pacienteCitas?.paciente?.nombre || ""}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <span style={{ color: "#666" }}>Documento:</span>{" "}
                  {dniPaciente}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Fecha cita actual</InputLabel>
            <Select
              value={idAgenda}
              label="Fecha cita actual"
              onChange={(e) => setIdAgenda(e.target.value)}
            >
              {pacienteCitas?.citasPendientes?.map(({ id, fecha }) => (
                <MenuItem key={id} value={id}>
                  {new Date(fecha.replace("Z", "")).toLocaleDateString(
                    "es-ES",
                    {
                      timeZone: "America/Bogota",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {idAgenda && (
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Resultado General"
                variant="outlined"
                multiline
                rows={4}
                value={resultadoGeneral}
                onChange={(e) => setResultadoGeneral(e.target.value)}
                margin="normal"
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Orden</InputLabel>
                <Select
                  value={tipoOrden}
                  label="Tipo de Orden"
                  onChange={(e) => {
                    const tipo = e.target.value;
                    setTipoOrden(tipo);
                    if (tipo === "Fórmula médica") {
                      if (listaDiagnosticos.length === 0) handleDiags();
                      if (listaMedicamentos.length === 0) handleMedicamentos();
                    } else if (tipo === "Remisión") {
                      if (listaServicios.length === 0) handleServiciosMedicos();
                    }
                  }}
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

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGuardarResultado}
                sx={{
                  mt: 4,
                  mb: 2,
                  bgcolor: "#4CAF50",
                  "&:hover": {
                    bgcolor: "#388E3C",
                  },
                }}
              >
                Guardar Resultado
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default MedicalOrderForm;
