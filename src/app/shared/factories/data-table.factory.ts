declare var $: any;
declare var moment: any;
declare var DataTable: any;

export default class DataTableFactory {
  private table: any;

  public drawTable(selector: string, options: any) {
    if (this.table) {
      this.table.destroy();
    }

    setTimeout(() => {
      moment.locale('pt-br');
      $.fn.DataTable.ext.type.order['date-br-pre'] = (a: any, b: any) => {
        if (a == null || a == '') {
          return 0;
        }
        const brDatea = a.split('/');
        return (brDatea[2] + brDatea[1] + brDatea[0]) * 1;
      };
      $.fn.DataTable.ext.type.order['date-br-asc'] = (a: any, b: any) => {
        return a < b ? -1 : a > b ? 1 : 0;
      };
      $.fn.DataTable.ext.type.order['date-br-desc'] = (a: any, b: any) => {
        return a < b ? 1 : a > b ? -1 : 0;
      };

      this.table = $(selector).DataTable({
        ...options,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json',
        },
        columnDefs: [
          {
            targets: 'no-sort',
            orderable: false,
          },
          {
            targets: 'date',
            type: 'date-br',
            render: function (data: any) {
              if (!data) return '';
              return moment.utc(data).local().format('DD/MM/YYYY');
            },
            orderable: true,
          },
          {
            targets: 'datetime',
            type: 'date-br',
            render: function (data: any) {
              if (!data) return '';
              return moment.utc(data).local().format('DD/MM/YYYY HH:mm');
            },
            orderable: true,
          },
        ],
        searching: true,
        info: false,
        lengthChange: false,
        sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
      });
    }, 10);
  }

  public destroy() {
    if (this.table) {
      this.table.destroy();
      this.table = null;
    }
  }

  public searchTable(value: string) {
    if (this.table) this.table.search(value).draw();
  }

  public reload() {
    this.table.columns.adjust().draw();
  }

  public obterDadosFiltro(): Array<any> {
    if (this.table) {
      var filteredRows = this.table.rows({ filter: 'applied' }).data().toArray();
      return filteredRows.map((value: any, index: any) => value);
    }

    return [];
  }
}
