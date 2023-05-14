import cookie from 'cookie';
import { API_URL } from '../../../../config/index';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver los temas'
            });
        }

        let q = req.query.page ? `?page=${req.query.page}` : '';

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/temas/${q}`, {
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
                error: 'Algo salió mal al intentar obtener los temas'
            });
        }
    } else if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para crear temas'
            });
        }

        const { nombre } = req.body;

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/temas/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre
                })
            });

            const data = await apiRes.json();
            
            if (apiRes.status === 201) {
                return res.status(201).json(data);
            } else {
                const flattenedResults = {};
                Object.keys(data).forEach((key) => {
                    flattenedResults[key] = data[key][0];
                });

                return res.status(apiRes.status).json({
                    error: flattenedResults
                });
            }
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
