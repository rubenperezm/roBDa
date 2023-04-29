import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Box } from "@mui/material";

export const ImageLightbox = (props) => {
    const { imagePath } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Box
                component="img"
                src={imagePath}
                onClick={() => setOpen(true)}
                sx={{
                    height: 'auto',
                    maxHeight: 400,
                    maxWidth: '80%',
                    borderRadius: 1,
                    display: 'block',
                    marginX: 'auto',
                    marginY: 2,
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 6px 20px 0 rgba(0, 0, 0, 0.07)",
                    cursor: 'pointer'
                }}
            />

            <Lightbox
                plugins={[Zoom]}
                open={open}
                closeOnBackdropClick={true}
                close={() => setOpen(false)}
                controller={{ closeOnBackdropClick: true }}
                slides={[
                    { src: imagePath },
                ]}

                carousel={{ finite: true }}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                    iconZoomIn: () => null,
                    iconZoomOut: () => null
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                }}
            />
        </>
    );
}
