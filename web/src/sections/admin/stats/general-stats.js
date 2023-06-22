import {
    Card,
    CardContent,
    CardHeader,
    Divider,
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
import { DonutSimple } from './donut-simple';
import { StatsCompeticion } from './stats-competicion';
import { DonutDuelo } from './donut-duelo';


export const GeneralStats = ({stats}) => {
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
                    <Grid item xs={12} sm={6} md={5}>
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
                    <Grid item xs={12} sm={6} md={5}>
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
                        <Card sx={{height: 600}}>
                            <CardHeader 
                                title='Preguntas por categoría' 
                                subheader='Cantidad de preguntas de cada tema e idioma'
                            />
                            <CardContent>
                            <TableContainer sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: 400 }}>
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
                        <Card sx={{height: 600}}>
                            <CardHeader
                                title="Estado de reportes"
                                subheader="Cantidad de reportes por estado"
                            />
                            <CardContent>
                                <DonutEvento data={stats?.reports}/>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Card sx={{height: 600}}>
                            <CardHeader
                                title="Respuestas"
                                subheader="Respuestas por tema e idioma"
                            />
                            <CardContent>
                                <DonutTemaIdioma data={stats?.porcentaje_acierto}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Divider sx={{mt: 2}}/>
                <Typography variant="h5" sx={{p: 2, mt: 2}}>
                    Estadísticas de repasos
                </Typography> 
                <Grid container spacing={2} display="flex" justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Card sx={{height: 350}}>
                            <CardHeader
                                title="Repasos totales"
                                subheader="Repasos realizados por alumnos"
                            />
                            <CardContent>
                                <TableContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: 200 }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tema</TableCell>
                                                <TableCell>Idioma</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats?.repasos_totales.map((row, index) => (
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
                        <Card sx={{height: 234, mt: 2}}>
                            <CardHeader
                                title="Preguntas por repaso"
                                subheader="Media de preguntas por repaso"
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {stats?.media_preguntas_repaso}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid> 
                    <Grid item xs={12} md={6}>
                        <Card sx={{height: 600}}>
                            <CardHeader
                                title="Aciertos en repasos"
                                subheader="Porcentaje de acierto en repasos"
                            />
                            <CardContent>
                                <DonutSimple data={stats?.aciertos_en_repasos} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Divider sx={{mt: 2}}/>
                <Typography variant="h5" sx={{p: 2, mt: 2}}>
                    Estadísticas de competiciones
                </Typography>  
                <Grid container spacing={2} display="flex" justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Card sx={{height: 450}}>
                            <CardHeader
                                title="Competiciones totales"
                                subheader="Competiciones creadas por los profesores"
                            />
                            <CardContent>
                            <TableContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: 350}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tema</TableCell>
                                                <TableCell>Idioma</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats?.eventos_totales.map((row, index) => (
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
                        <Card sx={{height: 450}}>
                            <CardHeader
                                title="Estadísticas de participación"
                                subheader="Datos de las participaciones en competiciones"
                            />
                            <CardContent>
                                <StatsCompeticion preguntas={stats?.preguntas_creadas_evento} puntos={stats?.media_puntos_evento} valoracion={stats?.media_valoracion_eventos}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Divider sx={{mt: 2}}/>
                <Typography variant="h5" sx={{p: 2, mt: 2}}>
                    Estadísticas de duelos
                </Typography>
                <Grid container spacing={2} display="flex" justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Card sx={{height: 450}}>
                            <CardHeader
                                title="Duelos totales"
                                subheader="Duelos creados por los alumnos"
                            />
                            <CardContent>
                                <TableContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: 350}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tema</TableCell>
                                                <TableCell>Idioma</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats?.duelos_totales.map((row, index) => (
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
                        <Card sx={{height: 450}}>
                            <CardHeader
                                title="Estado de duelos"
                                subheader="Número de duelos por estado"
                            />
                            <CardContent>
                                <DonutDuelo data={stats?.estado_duelos}/>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>



            </CardContent>
        </Card>
    );
}