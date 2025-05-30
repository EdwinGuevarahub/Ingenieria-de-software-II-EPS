import { useEffect, useState } from 'react';
import {
	Box,
	Collapse,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
	IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const ExpandableTable = ({ columns, data, rowKey, renderExpandedContent, fetchDetails, onExpandedChange = () => {} }) => {
	const [expandedState, setExpandedState] = useState({
		index: null, // Índice de la fila expandida
		loadingIndex: null, // Índice de la fila que está cargando detalles.
		details: null, // Datos del detalle expandido
		idDetails: null // ID del detalle expandido
	});

	const collapse = () => {
		// Notificando sobre colapso de la fila abierta.
		if (expandedState.idDetails !== null)
			onExpandedChange(expandedState.idDetails, false);

		setExpandedState({
			index: null,
			loadingIndex: null,
			idDetails: null,
			details: null
		});
	};

	useEffect(() => {
		collapse();
	}, [data]);

	const handleRowClick = async (index, row) => {
		const earlyReturn = expandedState.index === index;
		collapse();

		if (earlyReturn)
			return;

		setExpandedState({
			index,
			loadingIndex: index,
			idDetails: row[rowKey],
			details: null
		});

		// Notificando sobre expansión de la nueva fila.
		onExpandedChange(row[rowKey], true);

		try {
			let result = [];

			if (Array.isArray(fetchDetails))
				result = await Promise.all(fetchDetails.map(fn => fn(row[rowKey])));
			else if (typeof fetchDetails === 'function')
				result = [await fetchDetails(row[rowKey])];

      setExpandedState(prevState => ({ ...prevState, details: result }));
		} catch (err) {
			console.error('Error al cargar detalle:', err);
		} finally {
      setExpandedState(prevState => ({ ...prevState, loadingIndex: null }));
		}
	};

	return (
		<Box>
			{Array.isArray(data) && data.length > 0 ? (
				data.map((row, index) => (
					<Paper
						key={index}
						elevation={3}
						sx={{
							mb: 2,
							borderRadius: 2,
							overflow: 'hidden',
							transition: 'all 0.3s ease',
							cursor: expandedState.index === index ? 'default' : 'pointer',
							'&:hover': expandedState.index === index
								? {}
								: {
									transform: 'scale(1.01)',
									boxShadow: 6
								  }
						}}
					>
						<TableContainer>
							<Table sx={{ tableLayout: 'fix', width: '100%' }}>
								<TableBody>
									{expandedState.index !== index && (
										<TableRow hover onClick={() => handleRowClick(index, row)}>
											{columns.map((col, i) => (
												<TableCell
													key={col.key}
													sx={{
														width: i === 0 ? '20px' : 'auto',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap'
													}}
												>
													{row[col.key]}
												</TableCell>
											))}
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<Collapse in={expandedState.index === index} timeout="auto" unmountOnExit>
							<Box sx={{ p: 4, bgcolor: '#f5f5f5', position: 'relative' }}>
								<IconButton
									size="big"
									onClick={collapse}
									sx={{ position: 'absolute', top: 8, right: 8 }}
								>
									<CloseIcon/>
								</IconButton>
								{expandedState.loadingIndex === index ? (
									<Typography variant="body2">Cargando detalles...</Typography>
								) : expandedState.details ? (
									renderExpandedContent(expandedState.details)
								) : (
									<Typography variant="body2">No hay información disponible.</Typography>
								)}
							</Box>
						</Collapse>
					</Paper>
				))
			) : (
				<Typography variant="body2" sx={{ p: 2 }}>
					No se han cargado los datos.
				</Typography>
			)}
		</Box>
	);
};

export default ExpandableTable;
