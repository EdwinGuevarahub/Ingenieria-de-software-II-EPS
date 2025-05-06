import React, { useState } from 'react';
import {
    Box,
    Collapse,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

const ExpandableTable = ({ columns, data, renderExpandedContent }) => {
    const [openRow, setOpenRow] = useState(null);

    const handleRowClick = (index) => {
        setOpenRow(openRow === index ? null : index);
    };

    return (
        <Box>
            {data.map((row, index) => (
                <Paper
                    key={index}
                    elevation={3}
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.01)',
                            boxShadow: 6
                        }
                    }}
                    onClick={() => handleRowClick(index)}
                >
                    <TableContainer>
                        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableBody>
                                <TableRow hover>
                                    {columns.map((col, index) => (
                                        <TableCell
                                            key={col.key}
                                            sx={{
                                                width: index === 0 ? '200px' : 'auto',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >{row[col.key]}</TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Collapse in={openRow === index} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            {renderExpandedContent ? renderExpandedContent(row) : (
                                <Typography variant="body2" color="text.secondary">
                                    No hay contenido adicional.
                                </Typography>
                            )}
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
};

export default ExpandableTable;
