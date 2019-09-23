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
  const marginTop5 = {
    marginTop:5
  }

  const verificationContainer = {
    position:'absolute', 
    width:'100%',
    height:'100%', 
    zIndex:10000, 
    background:'white',
    borderRadius:20

  }
  const verficationPaper = {
    position:'relative',
    background:'rgba(255, 251, 219, 0.36)', 
    height:640,
    maxHeight:640, 
    minHeight:640,
    overflowY:'hidden'
  }

  const closeButton ={
    background:'crimson',
    color:'white',
    position:'absolute',
    top:15,right:20
  }
  const summaryH3 = {
    marginBottom:10,
    fontWeight:700, 
    borderRadius: 31, 
    color:'black', 
   // border:'solid 0px black', 
    //background:'rgba(145, 255, 199, 0.07)', 
    padding:'12px 25px', 
    paddingLeft:0
  }
module.exports = {
  vanish,
  styles,
  uploadBox,
  marginTop5,
  verficationPaper,
  verificationContainer, 
  closeButton,
  summaryH3
};