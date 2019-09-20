const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});

const vanish = {
  display:'none'
}
  // const fileContainer = {
  //   padding:10,
  //   border:'solid 2px white',
  //   borderRadius:7,
  //   background:'red',
  //   pointerEvents:'none'
  // }
  // const fileInput = {
  //   top:0,
  //   left:0,
  //   right:0,
  //   bottom:0,
  //   position:'absolute',
  //   width:'100%',
  //   height:'100%',
  //   opacity:0, 
  //   pointerEvents:'all'
  // }
  const uploadBox = {
    border:'solid 1px #e0e0e0', 
    borderRadius:5,
    padding:25
  }
module.exports = {
  vanish,
  styles,
  uploadBox
};