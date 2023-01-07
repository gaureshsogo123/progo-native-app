import React from "react";
import { View, ScrollView } from "react-native";
import { DataTable, Text, useTheme } from "react-native-paper";

function Table() {
  const products = [
    {
      productname: "Mango",
      productquantity: 3,
    },
    {
      productname: "Oil",
      productquantity: 4,
    },
    {
      productname: "Bread",
      productquantity: 6,
    },
    {
      productname: "Oil",
      productquantity: 4,
    },
    {
      productname: "Mango",
      productquantity: 3,
    },
    {
      productname: "Oil",
      productquantity: 4,
    },
    {
      productname: "Bread",
      productquantity: 6,
    },
  ];

  const theme = useTheme();
  return (
    <View>
      <DataTable>
        <View style={{ backgroundColor: theme.colors.secondaryContainer }}>
          <DataTable.Header>
            <DataTable.Title>
              <Text style={{ color: "black", fontWeight: "600", fontSize: 12 }}>
                Item Name
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={{ color: "black", fontWeight: "600", fontSize: 12 }}>
                Qty
              </Text>
            </DataTable.Title>
          </DataTable.Header>
        </View>
        {products.map((val, i) => {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "#fafafa",
                borderWidth: 0.5,
                borderColor: "silver",
              }}
            >
              <DataTable.Row key={i}>
                <DataTable.Cell style={{ flex: 3 }}>
                  {val.productname}
                </DataTable.Cell>
                <DataTable.Cell numeric>{val.productquantity}</DataTable.Cell>
              </DataTable.Row>
            </View>
          );
        })}
      </DataTable>
    </View>
  );
}

export default Table;
