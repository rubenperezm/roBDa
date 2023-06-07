import cookie from 'cookie';
import formidable from 'formidable';
import { Blob } from 'buffer';
import fs from 'fs';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver las imágenes'
            });
        }

        const page = req.query.page ?? 1;
        const { nombre, tema } = req.query;

        let q = '';
        if (nombre) {
            q += `&nombre=${nombre}`;
        }
        if (tema) {
            q += `&tema=${tema}`;
        }

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/imagenes/?page=${page}${q}`, {
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
                error: 'Algo salió mal al intentar obtener las imágenes'
            });
        }
    } else if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para crear imágenes'
            });
        }

        const form = new formidable.IncomingForm();
        const formData = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err)reject(err);
                resolve({ fields, files });
            });
        });

        const { path } = formData.files;
        const { nombre, tema } = formData.fields;

        const newFormData = new FormData();


        const buffer = fs.readFileSync(path.filepath);
        const blob = new Blob([buffer]);

        newFormData.append('path', blob, path.originalFilename);
        newFormData.append('nombre', nombre);
        newFormData.append('tema', tema);

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/imagenes/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                },
                body: newFormData
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

export const config = {
    api: {
      bodyParser: false,
    },
  };