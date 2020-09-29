<script>
export default {
  name: 'TableExpand',
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
    render: {
      type: Function,
      default() {
        return {};
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    column: {
      type: Object,
      default: null,
    },
  },
  render(h) {
    const params = {
      row: this.row,
      column: this.column,
      index: this.index,
    };
    const renderFun = this.render(h, params);
    if (typeof(renderFun) === 'string') {
      return (<div>{renderFun}</div>);
    }
    return renderFun;
  },
};
</script>
