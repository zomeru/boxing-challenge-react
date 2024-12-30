import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { Product, ProductSelection } from "../types";

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: ProductSelection[];
  onProductsChange: (products: ProductSelection[]) => void;
  maxProducts: number;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProducts,
  onProductsChange,
  maxProducts,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddProduct = () => {
    if (selectedProducts.length >= maxProducts) return;
    onProductsChange([
      ...selectedProducts,
      { productId: products[0].id, quantity: 1 },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...selectedProducts];
    newProducts.splice(index, 1);
    onProductsChange(newProducts);
  };

  const handleClearProducts = () => {
    onProductsChange([]);
  };

  const handleProductChange = (
    index: number,
    event: SelectChangeEvent<number>,
  ) => {
    const newProducts = [...selectedProducts];
    newProducts[index] = {
      ...newProducts[index],
      productId: Number(event.target.value),
    };
    onProductsChange(newProducts);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const quantity = Math.max(1, parseInt(event.target.value) || 1);
    const newProducts = [...selectedProducts];
    newProducts[index] = { ...newProducts[index], quantity };
    onProductsChange(newProducts);
  };

  const getProductDetails = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product
      ? `${product.length}x${product.width}x${product.height}cm, ${product.weight}kg`
      : "";
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        background: "background.paper",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" component="h2">
          Select Products
        </Typography>
        <Chip
          label={`${selectedProducts.length}/${maxProducts} items`}
          color={
            selectedProducts.length === maxProducts ? "warning" : "default"
          }
          size="small"
        />
      </Box>

      <Stack spacing={3}>
        {selectedProducts.map((selection, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { xs: "stretch", sm: "center" },
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              position: "relative",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <FormControl fullWidth>
              <Select
                value={selection.productId}
                onChange={(e) =>
                  handleProductChange(index, e as SelectChangeEvent<number>)
                }
                size="small"
                inputProps={{
                  "data-testid": `product-select-${index}`,
                }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography>{product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getProductDetails(product.id)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <TextField
                type="number"
                value={selection.quantity}
                onChange={(e) => handleQuantityChange(e, index)}
                size="small"
                label="Quantity"
                InputProps={{ inputProps: { min: 1 } }}
                sx={{
                  width: { xs: "100%", sm: "120px" },
                }}
              />

              <Tooltip title="Remove item" aria-label="Remove Item">
                <IconButton
                  onClick={() => handleRemoveProduct(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title={getProductDetails(selection.productId)}>
              <InfoIcon
                sx={{
                  position: "absolute",
                  right: { xs: 48, sm: 8 },
                  top: 8,
                  color: "action.active",
                  display: { xs: "block", sm: "none" },
                }}
              />
            </Tooltip>
          </Box>
        ))}

        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            disabled={selectedProducts.length === maxProducts}
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            variant="outlined"
            color="primary"
            fullWidth={isMobile}
            sx={{
              mt: 2,
              alignSelf: { xs: "stretch", sm: "flex-start" },
            }}
          >
            Add Product
          </Button>
          <Button
            disabled={selectedProducts.length === 0}
            startIcon={<DeleteIcon />}
            onClick={handleClearProducts}
            variant="outlined"
            color="secondary"
            fullWidth={isMobile}
            sx={{
              mt: 2,
              alignSelf: { xs: "stretch", sm: "flex-start" },
            }}
          >
            Clear Items
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};
