// src/components/consultorios/ConsultorioLista.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Pagination, Fab, Button } from "@mui/material";
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

const ConsultorioLista = () => {
  // Estado modal
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Datos y paginación
  const [consultorios, setConsultorios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const Q_SIZE = 5;

  // Filtros
  const [numeroFiltro, setNumeroFiltro] = useState("");
  const [servicioFiltro, setServicioFiltro] = useState("");
  const [serviciosOpts, setServiciosOpts] = useState([]);

  // 1. Carga opciones de servicios
  const fetchServicios = useCallback(async () => {
    try {
      const { servicio } = await listaServiciosMedicos();
      setServiciosOpts(
        servicio.map((s) => ({
          label: s.nombre,
          value: s.cups,
        }))
      );
    } catch (e) {
      console.error("Error cargando servicios:", e);
    }
  }, []);

  // 2. Carga consultorios, mapeando para incluir compositeId
  const fetchConsultorios = useCallback(async () => {
    try {
      const { totalPaginas: tp, consultorios: data } = await listarConsultorios(
        {
          qPage: pagina - 1,
          qSize: Q_SIZE,
          idConsultorioLike: numeroFiltro || undefined,
          cupsServicioMedico: servicioFiltro || undefined,
        }
      );

      const withComposite = data.map((c) => ({
        ...c,
        compositeId: `${c.idIps}-${c.idConsultorio}`,
      }));
      console.log("Consultorios con compositeId:", withComposite);

      setConsultorios(withComposite);
      setTotalPaginas(tp);
    } catch (e) {
      console.error("Error listando consultorios:", e);
    }
  }, [pagina, numeroFiltro, servicioFiltro]);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);
  useEffect(() => {
    if (serviciosOpts.length || (!numeroFiltro && !servicioFiltro)) {
      fetchConsultorios();
    }
  }, [fetchConsultorios, serviciosOpts, numeroFiltro, servicioFiltro]);

  // 3. Abrir modal para nuevo
  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };

  // 4. Al guardar (crear o actualizar)
  const handleSave = async (formData) => {
    try {
      if (formData.idConsultorio) {
        await actualizarConsultorio(formData);
      } else {
        await crearConsultorio(formData);
      }
      setOpenForm(false);
      fetchConsultorios();
    } catch (e) {
      console.error("Error guardando consultorio:", e);
    }
  };

  // 5. Configuración de la tabla
   const columns = [
    { key: "idConsultorio", label: "Número" },
    { key: "nombreServicioMedico", label: "Servicio" },
  ];

  const fetchDetails = [
    async (compositeId) => {
      const [idIps, idConsultorio] = compositeId.split("-");
      console.log("Fetching details for:", idIps, idConsultorio);

      const resp = await obtenerConsultorio(
        Number(idIps),
        Number(idConsultorio)
      );
      
      // Resp is now expected to be the actual consultorio object, e.g.,
      // { idIps: 1, idConsultorio: 102, ... } or { idIps: undefined, ... } if not found/error.
      console.log("Fetched consultorio details (resp):", resp);

      // Return the consultorio detail object directly
      return resp;
    },
  ];
  

  const renderExpanded = ([det]) => (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography>
        <strong>IPS ID:</strong> {det.idIps}
      </Typography>
      <Typography>
        <strong>Consultorio ID:</strong> {det.idConsultorio}
      </Typography>
      <Typography>
        <strong>Servicio:</strong> {det.nombreServicioMedico}
      </Typography>
      <Button
        size="small"
        startIcon={<AddIcon sx={{ transform: "rotate(45deg)" }} />}
        onClick={() => {
          setEditData(det);
          setOpenForm(true);
        }}
      >
        Editar
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", gap: 4, p: 3 }}>
      {/* Panel filtros */}
      <Box
        sx={{
          width: 280,
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "sticky",
          top: 80,
        }}
      >
        <Typography variant="h6">Filtros</Typography>
        <SearchFilter
          label="Número"
          value={numeroFiltro}
          onChange={setNumeroFiltro}
        />
        <SelectFilter
          placeholder="Todos servicios"
          value={servicioFiltro}
          onChange={setServicioFiltro}
          options={serviciosOpts}
        />
        <Button onClick={() => setPagina(1)}>Buscar</Button>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Consultorios
        </Typography>

        <ExpandableTable
          data={consultorios}
          columns={columns}
          rowKey="compositeId"
          fetchDetails={fetchDetails}
          renderExpandedContent={renderExpanded}
        />

        <Pagination
          count={totalPaginas}
          page={pagina}
          onChange={(_, p) => setPagina(p)}
          showFirstButton
          showLastButton
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />

        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
          onClick={handleAdd}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Modal formulario */}
      {openForm && (
        <ConsultorioFormulario
          open={openForm}
          initialData={editData}
          onCancel={() => setOpenForm(false)}
          onSubmit={handleSave}
        />
      )}
    </Box>
  );
};

export default ConsultorioLista;
