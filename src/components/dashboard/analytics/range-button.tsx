import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

export function RangeButton({ range, setParams, params }: any): React.JSX.Element {

    const handleChange = (
      event: React.MouseEvent<HTMLElement>,
      newRange: string,
    ) => {
      setParams((params: any) => {
        params.set("range", newRange);
        return params;
      });
    };
    return (
        <ToggleButtonGroup
        color="primary"
        value={range}
        exclusive
        onChange={handleChange}
        sx={{
          backgroundColor: "var(--mui-palette-background-paper)",
        }}
        >
            <ToggleButton sx={{
                textTransform: 'capitalize'
            }} value="day">Day</ToggleButton>
            <ToggleButton sx={{
                textTransform: 'capitalize'
            }} value="week">Week</ToggleButton>
            <ToggleButton sx={{
                textTransform: 'capitalize'
            }} value="month">Month</ToggleButton>
            <ToggleButton sx={{
                textTransform: 'capitalize'
            }} value="quarter">Quarter</ToggleButton>
        </ToggleButtonGroup>
    )
}
