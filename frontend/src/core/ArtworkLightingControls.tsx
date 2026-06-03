import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import HighlightOutlinedIcon from "@mui/icons-material/HighlightOutlined";

export type LightingMode = "daylight" | "evening" | "gallery";

interface Props {
    value: LightingMode;
    onChange: (mode: LightingMode) => void;
}

const ArtworkLightingControls: React.FC<Props> = ({ value, onChange }) => (
    <Stack spacing={1} sx={{ mt: 2, maxWidth: 380 }}>
        <Typography variant="body2" color="text.secondary">
            Preview lighting
        </Typography>

        <ToggleButtonGroup
            exclusive
            size="small"
            value={value}
            onChange={(_, nextValue) => {
                if (nextValue) onChange(nextValue);
            }}
            aria-label="Artwork lighting preview"
        >
            <ToggleButton value="daylight">
                <WbSunnyOutlinedIcon fontSize="small" />
                Daylight
            </ToggleButton>
            <ToggleButton value="evening">
                <NightsStayOutlinedIcon fontSize="small" />
                Evening
            </ToggleButton>
            <ToggleButton value="gallery">
                <HighlightOutlinedIcon fontSize="small" />
                Gallery
            </ToggleButton>
        </ToggleButtonGroup>
    </Stack>
);

export default ArtworkLightingControls;