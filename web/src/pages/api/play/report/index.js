import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para reportar preguntas'
            });
        }

        const { log, motivo, descripcion } = req.body;

        const body = JSON.stringify({
            log,
            motivo,
            descripcion
        });

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/reportar/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body
            });

            const data = await apiRes.json();
            return res.status(apiRes.status).json({
                data
            });

        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
