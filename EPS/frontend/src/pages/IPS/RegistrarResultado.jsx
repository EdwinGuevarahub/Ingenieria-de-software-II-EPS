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
  Snackbar,
  Alert,
  Slide,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  obtenerPacienteCitas,
  obtenerDiagnosticos,
  obtenerMedicamentos,
  obtenerServiciosMedicos,
  registrarResultado,
  actualizarResultadoAgenda
} from "../../services/resultadosService";

// Tipos de órdenes médicas
const TIPOS_ORDEN = ["Fórmula médica", "Remisión"];

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

function MedicalOrderForm() {
  const [dniPaciente, setDniPaciente] = useState("");
  const [idAgenda, setIdAgenda] = useState("");
  const [resultadoGeneral, setResultadoGeneral] = useState("");
  const [tipoOrden, setTipoOrden] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [obsDiagnostico, setObsDiagnostico] = useState("");
  const [medicamentos, setMedicamentos] = useState([
    { medicamento: "", cantidad: "", receta: "" },
  ]);
  const [servicioMedico, setServicioMedico] = useState("");

  // Estado para controlar el switch
  const [showExtendedOptions, setShowExtendedOptions] = useState(false);

  const [pacienteCitas, setPacienteCitas] = useState([]);
  const [listaDiagnosticos, setListaDiagnosticos] = useState([]);
  const [listaMedicamentos, setListaMedicamentos] = useState([]);
  const [listaServicios, setListaServicios] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [dniError, setDniError] = useState(false);
  const [dniErrorMensaje, setDniErrorMensaje] = useState("");
  const [loadingFechas, setLoadingFechas] = useState(false);

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    resultadoGeneral: false,
    tipoResultado: false,
    diagnostico: false,
    obsDiagnostico: false,
    medicamentos: Array(1).fill({
      medicamento: false,
      cantidad: false,
      receta: false,
    }),
    servicioMedico: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loadingFechas) {
      event.preventDefault();
      handleSubmitId(event);
    }
  };

  // Al ingresar el DNI del paciente
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
  const handleDiagnosticos = async () => {
    try {
      const { data: resDiagnosticos } = await obtenerDiagnosticos();

      if (Array.isArray(resDiagnosticos) && resDiagnosticos.length > 0) {
        setListaDiagnosticos(resDiagnosticos);
      } else {
        showMessage("No se pudieron obtener los diagnósticos", "warning");
      }
    } catch (error) {
      showMessage("Error al cargar diagnósticos", "error");
    }
  };

  // Obtener lista de Medicamentos
  const handleMedicamentos = async () => {
    try {
      const { data: listaMedicamentos } = await obtenerMedicamentos();

      if (Array.isArray(listaMedicamentos) && listaMedicamentos.length > 0) {
        setListaMedicamentos(listaMedicamentos);
      } else {
        showMessage("No se pudieron obtener los medicamentos", "warning");
      }
    } catch (error) {
      showMessage("Error al cargar medicamentos", "error");
    }
  };

  // Obtener lista de servicios medicos
  const handleServiciosMedicos = async () => {
    try {
      const { data: listaServicios } = await obtenerServiciosMedicos();

      if (Array.isArray(listaServicios) && listaServicios.length > 0) {
        setListaServicios(listaServicios);
      } else {
        showMessage("No se pudieron obtener los servicios médicos", "warning");
      }
    } catch (error) {
      showMessage("Error al cargar servicios médicos", "error");
    }
  };

  // Función para mostrar mensajes al usuario
  const showMessage = (message, severity = "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Manejar el cierre del Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Añadir un nuevo medicamento para el diagnostico (interfaz)
  const handleAddMedicamento = () => {
    const newMedicamentos = [
      ...medicamentos,
      { medicamento: "", cantidad: "", receta: "" },
    ];
    setMedicamentos(newMedicamentos);

    // Actualizar estado de errores para incluir el nuevo medicamento
    setErrors((prev) => ({
      ...prev,
      medicamentos: [
        ...prev.medicamentos,
        { medicamento: false, cantidad: false, receta: false },
      ],
    }));
  };

  // Eliminar un medicamento del diagnostico (interfaz)
  const handleRemoveMedicamento = (index) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos.splice(index, 1);
    setMedicamentos(newMedicamentos);

    // Actualizar estado de errores eliminando el medicamento correspondiente
    const newErrors = { ...errors };
    newErrors.medicamentos.splice(index, 1);
    setErrors(newErrors);
  };

  // Asignar el medicamento seleccionado de la lista desplegable
  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;
    setMedicamentos(newMedicamentos);

    // Limpiar el error cuando se ingresa un valor
    const newErrors = { ...errors };
    newErrors.medicamentos[index][field] = false;
    setErrors(newErrors);
  };

  // Función de validación del formulario
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validar resultado general
    if (!resultadoGeneral.trim()) {
      newErrors.resultadoGeneral = true;
      isValid = false;
    } else {
      newErrors.resultadoGeneral = false;
    }

    // Si las opciones extendidas están activas, hacer validaciones adicionales
    if (showExtendedOptions) {
      // Validar diagnóstico
      if (!diagnostico) {
        newErrors.diagnostico = true;
        isValid = false;
      } else {
        newErrors.diagnostico = false;
      }

      // Validar observación del diagnóstico
      if (!obsDiagnostico.trim()) {
        newErrors.obsDiagnostico = true;
        isValid = false;
      } else {
        newErrors.obsDiagnostico = false;
      }

      // Validar tipo de orden
      if (!tipoOrden) {
        newErrors.tipoResultado = true;
        isValid = false;
      } else {
        newErrors.tipoResultado = false;
      }

      // Validaciones específicas según el tipo de orden
      if (tipoOrden === "Fórmula médica") {
        // Validar medicamentos
        newErrors.medicamentos = medicamentos.map((med) => ({
          medicamento: !med.medicamento,
          cantidad: !med.cantidad,
          receta: !med.receta,
        }));

        if (
          medicamentos.some(
            (med) => !med.medicamento || !med.cantidad || !med.receta
          )
        ) {
          isValid = false;
        }
      } else if (tipoOrden === "Remisión") {
        // Validar servicio médico
        if (!servicioMedico) {
          newErrors.servicioMedico = true;
          isValid = false;
        } else {
          newErrors.servicioMedico = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Guardar el Resultado (General, diagnostico y medicamentos u Ordenes)
  const handleGuardarResultado = () => {
    if (!validateForm()) {
      showMessage("Por favor complete todos los campos requeridos", "error");
      return;
    }

    // Si el switch está desactivado, solo guarda el resultado general
    if (!showExtendedOptions) {
      guardarResultadoGeneral();
    } else {
      if (tipoOrden === "Fórmula médica") {
        guardarFormulaMedica();
      } else if (tipoOrden === "Remisión") {
        guardarRemision();
      } else {
        showMessage("Seleccione el tipo de orden", "error");
      }
    }
  };

  const guardarResultadoGeneral = async () => {
    try {
      const resultadoJSON = { resultado: resultadoGeneral || null };
      const agendaId = parseInt(idAgenda) || null;
      await actualizarResultadoAgenda(agendaId, resultadoJSON);
      showMessage("Resultado guardado con éxito", "success");
      resetForm();
    } catch (error) {
      showMessage("Error al guardar la orden de exámenes", "error");
    }
  };

  const guardarFormulaMedica = async () => {
    try {
      const medicamentosFormateados = medicamentos.map((med) => {
        const medicamentoSeleccionado = listaMedicamentos.find(
          (medicamento) => medicamento.nombre === med.medicamento
        );

        return {
          medicamento: {
            id: medicamentoSeleccionado?.id || null,
            nombre: med.medicamento,
          },
          cantidad: parseInt(med.cantidad),
          dosis: med.receta || "",
        };
      });

      const resultadoJSON = {
        agendaId: parseInt(idAgenda) || null,
        resultadoAgenda: resultadoGeneral || null,
        diagnostico: diagnostico || null,
        observacion: obsDiagnostico || null,
        medicamentos: medicamentosFormateados,
      };

      await registrarResultado(resultadoJSON);

      showMessage("Fórmula médica guardada con éxito", "success");
      resetForm();
    } catch (error) {
      showMessage("Error al guardar la fórmula médica", "error");
    }
  };

  const guardarRemision = async () => {
    try {
      const resultadoJSON = {
        agendaId: parseInt(idAgenda) || null,
        resultadoAgenda: resultadoGeneral || null,
        diagnostico: diagnostico || null,
        observacion: obsDiagnostico || null,
        servicioMedico: servicioMedico || null,
      };

      await registrarResultado(resultadoJSON);

      showMessage("Remisión guardada con éxito", "success");
      resetForm();
    } catch (error) {
      showMessage("Error al guardar la remisión", "error");
    }
  };

  // Resetear el formulario después de guardar
  const resetForm = () => {
    setResultadoGeneral("");
    setTipoOrden("");
    setDiagnostico("");
    setObsDiagnostico("");
    setMedicamentos([{ medicamento: "", cantidad: "", receta: "" }]);
    setServicioMedico("");
    setShowExtendedOptions(false);
    setErrors({
      resultadoGeneral: false,
      tipoResultado: false,
      diagnostico: false,
      obsDiagnostico: false,
      medicamentos: [{ medicamento: false, cantidad: false, receta: false }],
      servicioMedico: false,
    });
  };

  const renderFormulaMedica = () => (
    <Box sx={{ mt: 3 }}>
      {/* Apartado de medicamentos */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Medicamentos
      </Typography>

      {medicamentos.map((med, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={4} xs={12} md={5}>
              <FormControl
                fullWidth
                margin="normal"
                error={errors.medicamentos[index]?.medicamento}
              >
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
                {errors.medicamentos[index]?.medicamento && (
                  <FormHelperText error>
                    Este campo es obligatorio
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={2} xs={12} md={2}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={med.cantidad}
                onChange={(e) =>
                  handleMedicamentoChange(index, "cantidad", e.target.value)
                }
                margin="normal"
                error={errors.medicamentos[index]?.cantidad}
                helperText={
                  errors.medicamentos[index]?.cantidad
                    ? "Este campo es obligatorio"
                    : ""
                }
              />
            </Grid>

            <Grid size={5} xs={12} md={6}>
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
                error={errors.medicamentos[index]?.receta}
                helperText={
                  errors.medicamentos[index]?.receta
                    ? "Este campo es obligatorio"
                    : ""
                }
              />
            </Grid>

            <Grid
              size={1}
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
    <Box>
      <FormControl fullWidth margin="normal" error={errors.servicioMedico}>
        <InputLabel>Especialidad</InputLabel>
        <Select
          value={servicioMedico}
          label="Especialidad"
          onChange={(e) => {
            setServicioMedico(e.target.value);
            setErrors((prev) => ({ ...prev, servicioMedico: false }));
          }}
        >
          {listaServicios.map((servicio) => (
            <MenuItem key={servicio.cups} value={servicio.cups}>
              {servicio.nombre} - {servicio.descripcion}
            </MenuItem>
          ))}
        </Select>
        {errors.servicioMedico && (
          <FormHelperText error>Este campo es obligatorio</FormHelperText>
        )}
      </FormControl>
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

      {/* Snackbar para mostrar mensajes al usuario */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        key={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
              <Grid xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <span style={{ color: "#666" }}>Nombre:</span>{" "}
                  {pacienteCitas?.paciente?.nombre || ""}
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1">
                  <span style={{ color: "#666" }}>Documento:</span>{" "}
                  {dniPaciente}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <FormControl fullWidth margin="normal" required>
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
                onChange={(e) => {
                  setResultadoGeneral(e.target.value);
                  setErrors((prev) => ({ ...prev, resultadoGeneral: false }));
                }}
                margin="normal"
                required
                error={errors.resultadoGeneral}
                helperText={
                  errors.resultadoGeneral ? "Este campo es obligatorio" : ""
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showExtendedOptions}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setShowExtendedOptions(isChecked);
                      if (isChecked) {
                        handleDiagnosticos();
                      }
                    }}
                    color="primary"
                  />
                }
                label="Incluir diagnóstico"
                sx={{ mt: 2, mb: 1 }}
              />

              {showExtendedOptions && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Diagnóstico
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid size={5} xs={12} md={5}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={errors.diagnostico}
                        >
                          <InputLabel>Diagnóstico</InputLabel>
                          <Select
                            value={diagnostico}
                            label="Diagnóstico"
                            onChange={(e) => {
                              setDiagnostico(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                diagnostico: false,
                              }));
                            }}
                          >
                            {listaDiagnosticos.map((diag) => (
                              <MenuItem key={diag.cie} value={diag.cie}>
                                {diag.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.diagnostico && (
                            <FormHelperText error>
                              Este campo es obligatorio
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={7} xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Observaciones del Diagnóstico"
                          variant="outlined"
                          multiline
                          rows={2}
                          value={obsDiagnostico}
                          onChange={(e) => {
                            setObsDiagnostico(e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              obsDiagnostico: false,
                            }));
                          }}
                          margin="normal"
                          placeholder="Ej: Asma leve, parcialmente controlada."
                          error={errors.obsDiagnostico}
                          helperText={
                            errors.obsDiagnostico
                              ? "Este campo es obligatorio"
                              : ""
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <FormControl
                    fullWidth
                    margin="normal"
                    error={errors.tipoResultado}
                    required
                  >
                    <InputLabel>Tipo de Orden</InputLabel>
                    <Select
                      value={tipoOrden}
                      label="Tipo de Orden"
                      onChange={(e) => {
                        const tipo = e.target.value;
                        setTipoOrden(tipo);
                        setErrors((prev) => ({
                          ...prev,
                          tipoResultado: false,
                        }));

                        if (
                          tipo === "Fórmula médica" &&
                          listaMedicamentos.length === 0
                        ) {
                          handleMedicamentos();
                        } else if (
                          tipo === "Remisión" &&
                          listaServicios.length === 0
                        ) {
                          handleServiciosMedicos();
                        }
                      }}
                    >
                      {TIPOS_ORDEN.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tipoResultado && (
                      <FormHelperText error>
                        Este campo es obligatorio
                      </FormHelperText>
                    )}
                  </FormControl>

                  {tipoOrden === "Fórmula médica" && renderFormulaMedica()}
                  {tipoOrden === "Remisión" && renderRemisionExamenes()}
                </>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGuardarResultado}
                disabled={!idAgenda || !resultadoGeneral}
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
