export class CalendarFakeData {
  public static events = [
    {
      id: 1,
      title: 'Mark Carson',
      start: '2022-09-01 11:00',
      end: '2022-09-02 09:35',
      reservation_for: "Mark Carson",
      location: "BIN 1",
      description: "",
    },
    {
      id: 2,
      title: 'Kerry Phillip',
      start: '2022-09-15 03:00',
      end: '2022-09-17 09:00',
      reservation_for: "Mark Carson",
      location: "BIN 1",
      description: "",
    },
    {
      id: 3,
      title: 'John Griffith',
      start: '2022-09-05 11:00',
      end: '2022-09-07 09:35',
      reservation_for: "Mark Carson",
      location: "BIN 1",
      description: "",
    },    
    {
      id: 5,
      title: 'Luios Young',
      start: '2022-09-11 01:00',
      end: '2022-09-12 09:35',
      reservation_for: "Mark Carson",
      location: "BIN 1",
      description: "",
    },    
    
    {
      id: 9,
      title: 'July Maynard',
      start: '2022-09-26 11:00',
      end: '2022-09-27 12:35',
      reservation_for: "Mark Carson",
      location: "BIN 1",
      description: "",
    }   
  ];
  public static calendar = [
    { id: 1, filter: 'Business', color: 'primary', checked: true },
    { id: 2, filter: 'Holiday', color: 'success', checked: true },
    { id: 3, filter: 'Personal', color: 'danger', checked: true },
    { id: 4, filter: 'Family', color: 'warning', checked: true },
    { id: 5, filter: 'ETC', color: 'info', checked: true }
  ];
}
