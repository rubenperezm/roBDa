import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { DonutTemaIdioma } from './donut-tema-idioma';
import { DonutEvento } from './donut-evento';


export const GeneralStats = ({stats}) => {
    console.log(stats)
    if (!stats) return null;
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{p: 2}}>
                    Estadísticas generales
                </Typography>
                <Grid container spacing={2} display="flex" justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                title="Usuarios"
                                subheader="Usuarios registrados"
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {stats?.usuarios}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                title="Tiempo total de juego"
                                subheader="Tiempo total empleado en responder preguntas"
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {stats?.tiempo_jugado?.horas ?? '0'}h {stats?.tiempo_jugado?.minutos ?? '0'}m {stats?.tiempo_jugado?.segundos ?? '0'}s
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                title="Preguntas activas"
                                subheader="Preguntas totales que no han sido eliminadas"
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {stats?.preguntas_totales}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                title="Partidas jugadas"
                                subheader="Partidas jugadas en cualquier modo de juego"
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {stats?.partidas_totales}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                title="Reportes totales"
                                subheader="Reportes creados por los alumnos"
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {stats?.reports_totales}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container mt={2} spacing={2} display="flex" justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Card sx={{height: 500}}>
                            <CardHeader 
                                title='Preguntas por categoría' 
                                subheader='Cantidad de preguntas de cada tema e idioma'
                            />
                            <CardContent>
                            <TableContainer sx={{ mt: 2, display: 'flex', justifyContent: 'center', maxHeight: 300 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tema</TableCell>
                                            <TableCell>Idioma</TableCell>
                                            <TableCell>Cantidad</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stats?.preguntas.map((row, index) => (
                                            <TableRow hover key={index + 1}>
                                                <TableCell>{row.tema}</TableCell>
                                                <TableCell>{row.idioma === 1 ? 'Español' : 'Inglés'}</TableCell>
                                                <TableCell>{row.numero}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{height: 500}}>
                            <CardHeader
                                title="Estado de reportes"
                                subheader="Cantidad de reportes por estado"
                            />
                            <CardContent>
                                <DonutEvento data={stats?.reports}/>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>    
            </CardContent>
        </Card>
    );
}