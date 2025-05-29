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


const ExpandableTable = ({ columns, data, rowKey, renderExpandedContent, fetchDetails }) => {
    const [openRowIndex, setOpenRowIndex] = useState(null);
    const [loadingRowIndex, setLoadingRowIndex] = useState(null);
    const [expandedData, setExpandedData] = useState(null);

    useEffect(() => {
        setOpenRowIndex(null);
        setLoadingRowIndex(null);
        setExpandedData(null);
    }, [data]);

    const handleRowClick = async (index, row) => {
        const isSameRow = openRowIndex === index;

        if (isSameRow) {
            setOpenRowIndex(null);
            setExpandedData(null);
            return;
        }

        setOpenRowIndex(index);
        setLoadingRowIndex(index);
        setExpandedData(null);

        try {
            let result = [];

            if (Array.isArray(fetchDetails)) {
                result = await Promise.all(fetchDetails.map(fn => fn(row[rowKey])));
            } else if (typeof fetchDetails === 'function') {
                result = [await fetchDetails(row[rowKey])];
            }

            setExpandedData(result);
        } catch (err) {
            console.error('Error al cargar detalle:', err);
        } finally {
            setLoadingRowIndex(null);
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
                            cursor: openRowIndex === index ? 'default' : 'pointer',
                            '&:hover': openRowIndex === index
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
                                    {openRowIndex !== index && (
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

                        <Collapse in={openRowIndex === index} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 4, bgcolor: '#f5f5f5', position: 'relative' }}>
                                <IconButton
                                    size="big"
                                    onClick={() => {
                                        setOpenRowIndex(null);
                                        setExpandedData(null);
                                    }}
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                >
                                    <CloseIcon/>
                                </IconButton>
                                {loadingRowIndex === index ? (
                                    <Typography variant="body2">Cargando detalles...</Typography>
                                ) : expandedData ? (
                                    renderExpandedContent(expandedData)
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
