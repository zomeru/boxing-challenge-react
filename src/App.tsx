import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { PackingResults, ProductSelector } from "./components";
import { boxes, products } from "./data";
import { appTheme } from "./theme";
import {
  PackingResult,
  Product,
  Box as ProductBox,
  ProductSelection,
} from "./types";
import { packProducts } from "./utils";

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<ProductSelection[]>(
    [],
  );
  const [packingResult, setPackingResult] = useState<PackingResult | null>(
    null,
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = ["Select Products", "Review Packing"];

  const handlePack = async () => {
    setIsCalculating(true);
    // Simulate calculation time for better UX
    setTimeout(() => {
      const result = packProducts(
        selectedProducts,
        products as Product[],
        boxes as ProductBox[],
      );
      setPackingResult(result);
      setActiveStep(1);
      setIsCalculating(false);
    }, 800);
  };

  const handleGoBack = () => {
    setPackingResult(null);
    setActiveStep(0);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          width: "100%",
          py: { xs: 2, sm: 4 },
        }}
      >
        <Container
          maxWidth="lg"
          style={{
            maxWidth: "700px",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: "transparent",
              p: { xs: 0, sm: 1 },
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{
                mb: 4,
                textAlign: { xs: "center", sm: "left" },
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              Boxing Challenge
            </Typography>

            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                display: { xs: "none", sm: "flex" },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Stack
              direction="column"
              spacing={4}
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              {activeStep === 0 ? (
                <Box>
                  <ProductSelector
                    products={products as Product[]}
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    maxProducts={10}
                  />
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handlePack}
                      disabled={selectedProducts.length === 0 || isCalculating}
                      size={isMobile ? "large" : "medium"}
                      sx={{
                        minWidth: { xs: "100%", sm: "200px" },
                      }}
                    >
                      {isCalculating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Calculate Packing"
                      )}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <PackingResults result={packingResult!} />
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleGoBack}
                      size={isMobile ? "large" : "medium"}
                      sx={{
                        minWidth: { xs: "100%", sm: "200px" },
                      }}
                    >
                      Go Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => window.print()}
                      size={isMobile ? "large" : "medium"}
                      sx={{
                        minWidth: { xs: "100%", sm: "200px" },
                      }}
                    >
                      Print Results
                    </Button>
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
