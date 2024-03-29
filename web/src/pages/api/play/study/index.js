import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver los repasos'
            });
        }

        const page = req.query.page ?? 1;
        const { name, tema, idioma } = req.query;

        let q = '';
        if (name) {
            q += `&name=${name}`;
        }
        if (tema) {
            q += `&tema=${tema}`;
        }
        if (idioma) {
            idioma.split(',').forEach(i => {
                q += `&idioma=${i}`;
            });
        }

        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/repaso/?page=${page}${q}`, {
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
        } catch (err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar obtener los repasos'
            });
        }
    }
    else if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para jugar partidas'
            });
        }

        const { tema, idioma } = req.body;

        const body = JSON.stringify({
            tema,
            idioma,
        });

        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/repaso/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();
            return res.status(apiRes.status).json(data);

        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
