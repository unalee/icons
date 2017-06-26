import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actionCreators from '../../actions/actionCreators'
import Page from '../page'

function mapStateToProps(state) {
  return {
    icons: state.icons,
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

const App = withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))

export default App
