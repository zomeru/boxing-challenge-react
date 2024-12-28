import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { PackingResult } from "../types";

interface PackingResultsProps {
  result: PackingResult;
}

export const PackingResults: React.FC<PackingResultsProps> = ({ result }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Packing Results
      </Typography>

      {!result.success && result.unpackableProducts && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Warning: Some products could not be packed</AlertTitle>
          {result.unpackableProducts.map((item, index) => (
            <Typography key={index} variant="body2" sx={{ mt: 1 }}>
              {item.quantity}x {item.product.name}: {item.reason}
            </Typography>
          ))}
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        {result.packedBoxes.map((packedBox, boxIndex) => {
          // console.log('products', packedBox.products);

          return (
            <Accordion key={boxIndex} defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  Box {boxIndex + 1}: {packedBox.box.name}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Dimensions: {packedBox.box.length}x{packedBox.box.width}x
                      {packedBox.box.height} cm
                    </Typography>
                    <Typography variant="body2">
                      Weight Limit: {packedBox.box.weight_limit} kg
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Total Weight: {packedBox.totalWeight.toFixed(1)} kg
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Utilization: {packedBox.utilization.toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={packedBox.utilization}
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Packed Items:
                </Typography>
                <List dense>
                  {packedBox.products.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <ListItemText
                        primary={`${item.quantity}x ${item.product.name}`}
                        secondary={`${item.product.length}x${item.product.width}x${item.product.height} cm, ${item.product.weight} kg each`}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Paper>
  );
};
