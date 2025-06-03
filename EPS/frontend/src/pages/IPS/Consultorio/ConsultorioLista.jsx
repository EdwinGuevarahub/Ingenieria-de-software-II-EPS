// src/components/consultorios/ConsultorioLista.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Pagination,
  Fab,
  Button,
  Grid,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import SearchFilter from "@/../../src/components/filters/SearchFilter";
import SelectFilter from "@/../../src/components/filters/SelectFilter";
import ExpandableTable from "@/../../src/components/list/ExpandableTable";

import ConsultorioFormulario from "./ConsultorioFormulario.jsx";
import {
  listarConsultorios,
  obtenerConsultorio,
  crearConsultorio,
  actualizarConsultorio,
} from "@/../../src/services/consultorioService.js";
import { listaServiciosMedicos } from "@/../../src/services/serviciosMedicosService.js";
import { useIpsContext } from "../../../contexts/UserIPSContext.js";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const ConsultorioLista = () => {

  // Contexto de autenticación para obtener el email del médico y su IPS
  const { ips } = useIpsContext();

  // Estados
  const [editData, setEditData] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Sobre la tabla
  const [consultorios, setConsultorios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [idConsultorioFiltro, setIdConsultorioFiltro] = useState("");
  const [servicioFiltro, setServicioFiltro] = useState("");
  const [serviciosOpts, setServiciosOpts] = useState([]);

  // Snackbar state y funciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMostrarFormulario = (consultorio = null) => {
    if (consultorio)
      setEditData(consultorio);
    else
      setEditData(null);

    setMostrarFormulario(true);
  };

  const handleOcultarFormulario = () => {
    setEditData(null);
    setMostrarFormulario(false);
  };

  const handleExpandedChange = (id, expanded) => {
    if (!expanded && editData)
      handleOcultarFormulario();
  };

  const handleSubmitConsultorio = async (consultorio) => {
    try {
      // Acceder a los campos de la estructura anidada
      consultorio.id.ips.id = ips.id; // Asegúrate que 'ips' tenga el ID correcto
      if (editData?.idConsultorio) {
        await actualizarConsultorio(consultorio);
        showMessage("Consultorio actualizado correctamente.", "success");
      }
      else {
        await crearConsultorio(consultorio);
        showMessage("Consultorio creado correctamente.", "success");
      }

      await fetchConsultorios(pagina);
      handleOcultarFormulario();
    } catch (e) {
      showMessage("Error guardando consultorio: " + e.message, "error");
      //console.error("Error guardando consultorio:", e);
    }
  };

  const fetchConsultorios = useCallback(
    async (paginaActual = 1) => {
      try {
        const filtros = {
          qPage: paginaActual - 1,
          qSize: 5,
          cupsServicioMedico: servicioFiltro || undefined,
          idConsultorioLike: idConsultorioFiltro || undefined,
          idIps: ips.id || undefined
        };
        const { consultorios: data, totalPaginas: tp } =
          ips && ips.id
            ? await listarConsultorios(filtros)
            : ([])

        const flattened = data.map((item) => ({
          idConsultorio: item.idConsultorio,
          idIps: item.idIps,
          servicioMedico: item.nombreServicioMedico,
          cupsServicioMedico: item.cupsServicioMedico,
        }));

        setConsultorios(flattened);
        setTotalPaginas(tp); // Usar la variable renombrada
      } catch (error) {
        console.error("Error cargando consultorios:", error);
      }
    },
    [idConsultorioFiltro, servicioFiltro, ips] // fetchConsultorios se recrea si estos filtros cambian
  );

  // Efecto para cargar los servicios médicos (opciones del select)
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const { servicio } = await listaServiciosMedicos();
        const opciones = servicio.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }));
        setServiciosOpts(opciones);
      } catch (e) {
        console.error("Error cargando servicios médicos:", e);
      }
    };

    fetchServicios();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Efecto para resetear la página a 1 cuando los filtros cambian
  useEffect(() => {
    if (idConsultorioFiltro !== "" || servicioFiltro !== "") {
      // Opcional: solo resetear si hay algún filtro activo o cambió
      setPagina(1);
    } else if (idConsultorioFiltro === "" && servicioFiltro === "") {
      // Si se limpian todos los filtros
      setPagina(1);
    }
  }, [idConsultorioFiltro, servicioFiltro]);

  useEffect(() => {
    fetchConsultorios(pagina);
  }, [pagina, fetchConsultorios]);

  return (
    <Box sx={{ width: "100%" }}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        Lista de Consultorios
      </Typography>

      {/* Filtros */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: "250px",
            xs: 12,
            sm: 6
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Número del Consultorio
          </Typography>
          <SearchFilter
            label="Buscar consultorio"
            value={idConsultorioFiltro}
            onChange={(value) => setIdConsultorioFiltro(value)}
            fullWidth
          />
        </Grid>
        <Grid
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: "250px",
            xs: 12,
            sm: 6
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Servicio médico asignado
          </Typography>
          <SelectFilter
            placeholder="Todos"
            value={servicioFiltro}
            onChange={(value) => setServicioFiltro(value)}
            options={serviciosOpts}
          />
        </Grid>
      </Grid>

      {mostrarFormulario && !editData && (
        <ConsultorioFormulario
          serviciosMedicos={serviciosOpts}
          onSubmit={handleSubmitConsultorio}
          onCancel={handleOcultarFormulario} // Para el botón cancelar dentro del form
        />
      )}

      {/* Tabla con datos aplanados */}
      <ExpandableTable
        columns={[
          { key: "idConsultorio", label: "Número" },
          { key: "servicioMedico", label: "Servicio" },
        ]}
        data={consultorios}
        rowKey="idConsultorio"
        onExpandedChange={handleExpandedChange}
        fetchDetails={[
          (idConsultorioRow) => {
            const fila = consultorios.find(
              (c) => c.idConsultorio === idConsultorioRow
            );
            if (!fila) {
              console.error(
                "Fila no encontrada para detalles:",
                idConsultorioRow,
                consultorios
              );
              return Promise.resolve([{ error: "Fila no encontrada." }]); // Devuelve un objeto de error para manejo en renderExpandedContent
            }

            return obtenerConsultorio(fila.idIps, idConsultorioRow);
          },
        ]}
        renderExpandedContent={(detalleArray) => {
          if (
            !Array.isArray(detalleArray) ||
            detalleArray.length === 0 ||
            !detalleArray[0]
          ) {
            return (
              <Typography sx={{ p: 1 }}>
                No hay detalles disponibles o error al cargar.
              </Typography>
            );
          }
          const detalle = detalleArray[0];
          if (detalle.error) {
            // Manejo del error devuelto por fetchDetails
            return (
              <Typography sx={{ p: 1, color: "error.main" }}>
                {detalle.error}
              </Typography>
            );
          }

          const idConsultorioDetalle = detalle.idConsultorio;
          const idIpsDetalle = detalle.idIps;
          const servicioNombreDetalle = detalle.nombreServicioMedico;
          const cupsServicioMedicoDetalle = detalle.cupsServicioMedico;

          if (mostrarFormulario && editData)
            return (
              <ConsultorioFormulario
                initialData={editData}
                serviciosMedicos={serviciosOpts}
                onSubmit={handleSubmitConsultorio}
                onCancel={handleOcultarFormulario}
              />
            );

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                p: 2,
                borderRadius: 2,
                gap: 2,
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6">
                  Consultorio #{idConsultorioDetalle}
                </Typography>
                <Typography variant="body2">
                  <strong>IPS ID:</strong> {idIpsDetalle}
                </Typography>
                <Typography variant="body2">
                  <strong>Servicio:</strong> {servicioNombreDetalle}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() =>
                    // Prepara los datos para el formulario de edición y lo muestra
                    handleMostrarFormulario({
                      idIps: idIpsDetalle,
                      idConsultorio: idConsultorioDetalle,
                      cupsServicioMedico: cupsServicioMedicoDetalle,
                    })
                  }
                  aria-label="Editar consultorio"
                >
                  Editar
                </Button>
              </Box>
            </Box>
          );
        }}
      />

      {/* Paginación */}
      <Pagination
        count={totalPaginas}
        page={pagina}
        onChange={(_, val) => setPagina(val)}
        sx={{ p: 2, display: "flex", justifyContent: "center" }}
        showFirstButton
        showLastButton
      />

      {/* Botón “Agregar” */}
      <Fab
        color="primary"
        aria-label="Agregar consultorio"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}
        onClick={() => handleMostrarFormulario()} // Llama sin datos para un nuevo consultorio
      >
        <AddIcon />
      </Fab>

    </Box>
  );
};

export default ConsultorioLista;
