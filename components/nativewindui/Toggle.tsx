import * as React from "react";
import { Text } from "react-native";
import { Toggle } from "../../src/components/ui/toggle";

export default function ToggleExampleScreen() {
    const [basicToggle, setBasicToggle] = React.useState(false);

    return (
        <Toggle pressed={basicToggle} onPressedChange={setBasicToggle}>
            <Text className="text-foreground font-medium">Toggle 1</Text>
        </Toggle>
    );
}
