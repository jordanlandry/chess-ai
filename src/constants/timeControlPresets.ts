type TimeControlPreset = {
  key: string;
  name: string;
  iconName: string;
  iconColor: string;
  time: number;
  increment: number;
};

export const timeControlPresets: TimeControlPreset[] = [
  {
    key: "1+0",
    name: "Bullet",
    iconName: "bullet",
    time: 1 * 60,
    increment: 0,
    iconColor: "brown",
  },
  {
    key: "1+1",
    name: "Bullet",
    iconName: "bullet",
    time: 1 * 60,
    increment: 1,
    iconColor: "brown",
  },
  {
    key: "2+1",
    name: "Bullet",
    iconName: "bullet",
    time: 2 * 60,
    increment: 1,
    iconColor: "brown",
  },
  {
    key: "3+0",
    name: "Blitz",
    iconName: "blitz",
    time: 3 * 60,
    increment: 0,
    iconColor: "orange",
  },
  {
    key: "3+2",
    name: "Blitz",
    iconName: "blitz",
    time: 3 * 60,
    increment: 2,
    iconColor: "orange",
  },
  {
    key: "5+0",
    name: "Blitz",
    iconName: "blitz",
    time: 5 * 60,
    increment: 0,
    iconColor: "orange",
  },
  {
    key: "10+0",
    name: "Rapid",
    iconName: "rapid",
    time: 10 * 60,
    increment: 0,
    iconColor: "green",
  },
  {
    key: "15+10",
    name: "Rapid",
    iconName: "rapid",
    time: 15 * 60,
    increment: 10,
    iconColor: "green",
  },
  {
    key: "30+0",
    name: "Rapid",
    iconName: "rapid",
    time: 30 * 60,
    increment: 0,
    iconColor: "green",
  },
];
