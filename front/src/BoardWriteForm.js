import React, { Component } from "react";
import CKEditor from "ckeditor4-react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import Loading from "./loading";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardWriteForm extends Component {
  state = {
    data: ""
  };

  componentDidMount() {
    if (this.props.location.query !== undefined) {
      this.boardTitle.value = this.props.location.query.title;
    }
  }

  componentWillMount(){
    if (this.props.location.query !== undefined) {
      this.setState({
        data: this.props.location.query.content
      });
    }
  }

  writeBoard = () => {
    let url;
    let send_param;

    const boardTitle = this.boardTitle.value;
    const boardContent = this.state.data;

    if (boardTitle === undefined || boardTitle === "") {
      alert("글 제목을 입력 해주세요.");
      this.boardTitle.focus();
      this.setState({ loading: false });
      return;
    } else if (boardContent === undefined || boardContent === "") {
      alert("글 내용을 입력 해주세요.");
      this.setState({ loading: false });
    }

    if (this.props.location.query !== undefined) {
      url = "http://localhost:8080/board/update";
      send_param = {
        headers,
        "_id" : this.props.location.query._id,
        "title": boardTitle,
        "content": boardContent
      };
    } else {
      url = "http://localhost:8080/board/write";
      send_param = {
        headers,
        "_id" : $.cookie("login_id"),
        "title": boardTitle,
        "content": boardContent
      };

    }

    axios
      .post(url, send_param)
      //정상 수행
      .then(returnData => {
        if (returnData.data.isViolence) {
          if(window.confirm(returnData.data.message)) {
            axios
              .post('http://localhost:8080/board/save', send_param)
              .then(returnData => {
                alert(returnData.data.message);
                window.location.href = "/";
              })
              .catch(err=> {
                alert("글쓰기 실패");
                this.setState({ loading: false });
              })
          } else  this.setState({ loading: false });
        } else if (returnData.data.message != null) {
          axios
            .post('http://localhost:8080/board/save', send_param)
            .then(returnData => {
              alert(returnData.data.message);
              window.location.href = "/";
            })
            .catch(err => {
              alert("글쓰기 실패");
              this.setState({ loading: false });
            })
        } else {
          alert("글쓰기 실패");
          this.setState({ loading: false });
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  onEditorChange = evt => {
    this.setState({
      data: evt.editor.getData()
    });
  };

  render() {
    const divStyle = {
      margin: 50
    };
    const titleStyle = {
      marginBottom: 5
    };
    const buttonStyle = {
      marginTop: 5
    };

    const { data, loading } = this.state;

    return (
      <div style={divStyle} className="App">
        <h2>글쓰기</h2>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="글 제목"
          ref={ref => (this.boardTitle = ref)}
        />
        <CKEditor
          data={this.state.data}
          onChange={this.onEditorChange}
        ></CKEditor>
        <Button style={buttonStyle} onClick={ () => { this.setState({ loading: true }, this.writeBoard) } } block>
          <div className="loading"> {loading ? <p>스퀘어봇이 열심히 검사중입니다..<Loading /></p> : "저장하기"} </div>
        </Button>
      </div>
    );
  }
}

export default BoardWriteForm;