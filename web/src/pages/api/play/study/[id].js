import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    // if (req.method === 'GET') {
    //     const cookies = cookie.parse(req.headers.cookie ?? '');
    //     const access = cookies.access ?? false;
        
    //     if (access === false) {
    //         return res.status(401).json({
    //             error: 'Usuario no autorizado para ver eventos'
    //         });
    //     }

    //     const { id } = req.query;
        
    //     try {
    //         const apiRes = await fetch(`${API_URL}/eventos/eventos/${id}/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Authorization': `Bearer ${access}`
    //             }
    //         });

    //         const data = await apiRes.json();
    //         if (apiRes.status === 200) {
    //             return res.status(200).json(data);
    //         } else {
    //             return res.status(apiRes.status).json(data);
    //         }
    //     } catch (err) {
    //         return res.status(500).json({
    //             error: err
    //         });
    //     }
    // }else 
    if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para jugar partidas'
            });
        }

        const { id } = req.query;

        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/repaso/${id}/`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                data.imagen = {path: data.imagen};
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
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
