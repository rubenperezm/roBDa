import cookie from 'cookie';
import { API_URL } from '../../config/index';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver las preguntas'
            });
        }

        const page = req.query.page ?? 1;
        const {creador, enunciado, tema, evento, estado, idioma} = req.query;

        let q = '';
        if (creador) {
            q += `&creador=${creador}`;
        }
        if (enunciado) {
            q += `&enunciado=${enunciado}`;
        }
        if (tema) {
            q += `&tema=${tema}`;
        }
        if (evento) {
            q += `&evento=${evento}`;
        }
        if (idioma) {
            idioma.split(',').forEach(i => {
                q += `&idioma=${i}`;
            });
        }
        if (estado) {
            estado.split(',').forEach(est => {
                q += `&estado=${est}`;
            });
        }

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/preguntas/?page=${page}${q}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(
                    data
);
            } else {
                return res.status(apiRes.status).json({
                    error: data
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar obtener la información del usuario'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
