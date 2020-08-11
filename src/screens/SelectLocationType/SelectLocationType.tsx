import React from "react";
import { RadioButton, Text } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import { COLOR } from "../../themes/Color";
import  styles  from "./SelectLocationType.style"
import { strings } from '../../locales';
import Button from "../../components/buttons/Button";


function SelectLocationType() {
  const [type, setType] = React.useState("floor");
  return (
    <>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.typeListItem}>
          <RadioButton value="floor" status={type==="floor"?"checked":"unchecked"} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType("floor")}>
            <Text style={styles.typeLabel}>{strings("SELECTLOCATIONTYPE.FLOOR")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="endcap" status={type==="endcap"?"checked":"unchecked"} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType("endcap")}>
            <Text style={styles.typeLabel}>{strings("SELECTLOCATIONTYPE.ENDCAP")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="pod" status={type==="pod"?"checked":"unchecked"} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType("pod")}>
            <Text style={styles.typeLabel}>{strings("SELECTLOCATIONTYPE.POD")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="display" status={type==="display"?"checked":"unchecked"} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType("display")}>
            <Text style={styles.typeLabel}>{strings("SELECTLOCATIONTYPE.DISPLAY")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="reserve" status={type==="reserve"?"checked":"unchecked"} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType("reserve")}>
            <Text style={styles.typeLabel}>{strings("SELECTLOCATIONTYPE.RESERVE")}</Text>
            </TouchableOpacity>
        </View>
      </RadioButton.Group>
      <View style={styles.container}>
        <Button title={strings("GENERICS.NEXT")} radius={0} onPress={()=>{console.log("Next button pressed.")}}/>
      </View>
    </>
  );
};

export default SelectLocationType;