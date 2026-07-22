import {Box} from '@mui/material'

const Collections = () => {
return (
    
    <Box>
        {categories.map(category =>(
            <Box key={category._id}>

            </Box>
        ))}
    </Box>
)
}

export default Collections