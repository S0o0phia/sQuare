import axios from 'axios';
import React, {Component} from 'react';
import { Button } from "react-bootstrap";
import {} from "jquery.cookie";
import Loading from "./loading";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class Comment extends Component{

  constructor(props) {
    super(props);
    this.state = {value: '', loading: false};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value, loading: event.target.loading});
  }

  writeComment = () => {
    let url;
    let send_param;

    const commentContent = this.state.value;
    const postId = this.props.postId;

    if (commentContent=== undefined || commentContent === "") {
      alert("댓글 내용을 입력 해주세요.");
      this.setState({ loading: false });
      return;
    } else {
      console.log(commentContent, postId);
      url = "http://localhost:8080/comment/write";
      send_param = {
        headers,
        "postId" : postId,
        "content": commentContent
      };
    }

    axios
      .post(url, send_param)
      //정상 수행
      .then(returnData => {
        if(returnData => returnData.data.isViolence) {
          if(returnData.data.message == '') {
            axios
              .post('http://localhost:8080/comment/save', send_param)
              .then(returnData => {
                alert(returnData.data.message);
                window.history.go();
              })
              .catch(err=> {
                alert("글쓰기 실패");
                this.setState({ loading: false });
              })
          } else {
            if(window.confirm(returnData.data.message)) {
              axios
                .post('http://localhost:8080/comment/save', send_param)
                .then(returnData => {
                  alert(returnData.data.message);
                  window.history.go();
                })
                .catch(err=> {
                  alert("글쓰기 실패");
                  this.setState({ loading: false });
                })
            } else this.setState({loading: false});
          }
        } else if(returnData.data.message != null) {
          axios
          .post('http://localhost:8080/comment/save', send_param)
          .then(returnData => {
            alert(returnData.data.message);
            window.history.go();
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
        this.setState({ loading: false });
      });
  };

  render() {
    const marginBottom = {
        marginBottom: 5
    };

    const { value, loading } = this.state;
    return (
        <div>
            <form style={{ display: 'flex', marginBottom: '30px' }}>
                <textarea
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={this.handleChange}
                value={this.state.value}
                placeholder="댓글을 작성해 주세요"
                />
                <br />
                <Button block style={{marginBottom, width: '20%'}} onClick={()=> {this.setState({loading:true}, this.writeComment)}}>
                  <div className="loading"> {loading ? <p>댓글 검사중..<Loading /></p> : "저장하기"} </div>
                </Button>
            </form>
        </div>
    );
  }
}

export default Comment;