<template>
    <div class="main">
        <div>
            <button type="primary" @click="roll">Roll</button>
            <TableView
              :headers="columns"
              :rows="items"
              :sort="sort1"
              :pagination="pagination"
            >
              <template v-slot:items="{ row }">
                <td>{{ row.line_id }}</td>
                <td>{{ row.cell_code }}</td>
                <td>{{ row.layer_code }}</td>
                <td>{{ row.cell_x }}</td>
                <td>{{ row.cell_y }}</td>
              </template>

              <template v-slot:no-data>
                <span>No data</span>
              </template>
            </TableView>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import TableView from './components/table/tableView'

export default {
  name: 'test',
  components: {
    TableView
  },
  data () {
    return {
      columns: [
        { 'label': '代號', 'field': 'line_id', 'sortable': true, 'type': 'String' },
        { 'label': '棟別', 'field': 'cell_code', 'sortable': true, 'type': 'String' },
        { 'label': '樓層', 'field': 'layer_code', 'sortable': true, 'type': 'String' },
        { 'label': 'X軸', 'field': 'cell_x', 'sortable': true, 'type': 'Number' }
      ],
      items: [],
      sort1: { field: 'line_id', order: 'asc' },
      pagination: {
        itemsPerPage: 10,
        align: 'center',
        visualStyle: 'select'
      }
    }
  },
  methods: {
    roll: function () {
      axios
        .post('http://localhost:3000/baseData', {
          input_parameter: 'A1F1A00A'
        })
        .then(response => {
          this.items = response.data
        })
        .catch(error => { // 请求失败处理
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.main {
  background-color: white
}
</style>
