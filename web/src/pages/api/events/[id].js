import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'DELETE') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para eliminar eventos'
            });
        }

        const { id } = req.query;

        try {
            const apiRes = await fetch(`${API_URL}/eventos/eventos/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            if (apiRes.status === 204) {
                return res.status(204).json({});
            } else {
                return res.status(apiRes.status).json({});
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    } else if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        
        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver eventos'
            });
        }

        const { id } = req.query;
        
        try {
            const apiRes = await fetch(`${API_URL}/eventos/eventos/${id}/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            const data = await apiRes.json();
            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json(data);
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    }else if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para modificar eventos'
            });
        }

        const { id } = req.query;

        const { name, tema, idioma, fechaInicio, finFase1, finFase2 } = req.body;

        const body = JSON.stringify({
            name,
            tema,
            idioma: idioma == 'Esp' ? 1 : 2,
            fechaInicio,
            finFase1,
            finFase2
        });

        try {
            const apiRes = await fetch(`${API_URL}/eventos/eventos/${id}/`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(data);
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
        res.setHeader('Allow', ['DELETE', 'GET', 'PUT']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
