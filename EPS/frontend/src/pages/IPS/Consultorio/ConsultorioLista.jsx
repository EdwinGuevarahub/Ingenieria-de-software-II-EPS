// src/components/consultorios/ConsultorioLista.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Pagination,
  Fab,
  Button,
  Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
import { getIpsByAdmIpsEmail } from '@/../../src/services/ipsService';
import { useAuthContext } from '@/../../src/contexts/AuthContext';

const ConsultorioLista = () => {

  // Contexto de autenticación para obtener el email del médico y su IPS
  const { subEmail } = useAuthContext();
  const [ips, setIps] = useState({});

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
      const idConsultorioDesdeForm = consultorio.id?.idConsultorio;
      const idIpsDesdeForm = consultorio.id?.ips?.id;
      const cupsDesdeForm = consultorio.servicioMedico?.cupsSermed;

      const datosEnviar = {
        id: {
          ips: {
            id: idIpsDesdeForm,
          },
          idConsultorio: idConsultorioDesdeForm,
        },
        servicioMedico: {
          cups: cupsDesdeForm,
        },
      };
      
      if (editData?.idConsultorio)
        await actualizarConsultorio(datosEnviar);
      else
        await crearConsultorio(datosEnviar);

      await fetchConsultorios(pagina);
      handleOcultarFormulario();
    } catch (e) {
      console.error("Error guardando consultorio:", e);
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
      setPagina(1); // Asegura que se recargue desde la página 1
    }
    // Para la primera carga, si quieres que se cargue en página 1,
    // el siguiente useEffect se encargará si pagina es 1 por defecto.
  }, [idConsultorioFiltro, servicioFiltro]);

  useEffect(() => {
    fetchConsultorios(pagina);
  }, [pagina, fetchConsultorios]);

  useEffect(() => {
    const fetchIps = async () => {
      try {
        const result = await getIpsByAdmIpsEmail(subEmail);
        setIps(result);
      } catch (error) {
        console.error('Error al cargar la ips del administrador: ', error);
      }
    };

    fetchIps();
  }, [subEmail]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Lista de Consultorios
      </Typography>

      {/* Filtros */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid
          item // Añadido para que sea un item de Grid
          xs={12}
          sm={6} // Ejemplo de responsividad
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: "250px",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Número del Consultorio
          </Typography>
          <SearchFilter
            label="Buscar consultorio"
            value={idConsultorioFiltro}
            onChange={(value) => setIdConsultorioFiltro(value)} // Asegúrate que SearchFilter pase el valor directamente
            fullWidth
          />
        </Grid>
        <Grid
          item // Añadido para que sea un item de Grid
          xs={12}
          sm={6} // Ejemplo de responsividad
          sx={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: "250px",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Servicio médico asignado
          </Typography>
          <SelectFilter
            placeholder="Todos"
            value={servicioFiltro}
            onChange={(value) => setServicioFiltro(value)} // Asegúrate que SelectFilter pase el valor directamente
            options={serviciosOpts}
            // fullWidth si quieres que ocupe todo el ancho del Grid item
          />
        </Grid>
      </Grid>

      {mostrarFormulario && !editData && (
        <ConsultorioFormulario
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
        rowKey="idConsultorio" // Asegúrate que este valor sea único en 'consultorios'
        onExpandedChange={handleExpandedChange}
        fetchDetails={[
          (idConsultorioRow) => {
            // Renombrado para evitar confusión con idConsultorio del scope superior
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
                  variant="outlined"
                  onClick={() =>
                    // Prepara los datos para el formulario de edición y lo muestra
                    handleMostrarFormulario({
                      idIps: idIpsDetalle,
                      idConsultorio: idConsultorioDetalle,
                      cupsServicioMedico: cupsServicioMedicoDetalle, // Asegúrate que este campo exista en 'detalle' o ajústalo
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
