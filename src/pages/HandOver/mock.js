import moment from 'moment';
export const mockList = new Array(10).fill(0).map((item, index) => ({
  id: index,
  name: `xingmin${index}`,
  nickName: `nickName${index}`,
  project: `project${index}`,
  time: moment().format("L"),
  state: index % 2 === 0 ? 'on' : 'close',
}));
