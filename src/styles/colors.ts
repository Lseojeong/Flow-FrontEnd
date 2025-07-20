const colors = {
  background: '#FFFFFF',
  text: {
    primary: '#000000',
  },

  Black: '#000000',
  White: '#ffffff',
  Light: '#e7ecf5',
  Light_hover: '#dbe3f0',
  Light_active: '#b5c4e1',
  Normal: '#0f429d',
  Normal_hover: '#0e3b8d',
  Normal_active: '#0c357e',
  Dark: '#0b3276',
  Dark_hover: '#09285e',
  Dark_active: '#071e47',
  Darker: '#051737',
  GridLine: '#F2F2F2',
  BoxText: '#848484',
  BoxStroke: '#C1C1C1',
  MainRed: '#FF3317',
} as const;

export type Colors = typeof colors;
export default colors;
