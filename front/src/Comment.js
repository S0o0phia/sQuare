import axios from 'axios';
import React, {Component} from 'react';
import { Button } from "react-bootstrap";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class Comment extends Component{

  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  writeComment = () => {
    let url;
    let send_param;

    const commentContent = this.state.value;
    const postId = this.props.postId;

    if (commentContent=== undefined || commentContent === "") {
      alert("댓글 내용을 입력 해주세요.");
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
        if (returnData.data.message) {
          alert(returnData.data.message);
          window.history.go();
        } else {
          alert("댓글 쓰기 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const marginBottom = {
        marginBottom: 5
    };

    return (
        <div>
            <form style={{ display: 'flex', marginBottom: '30px' }} onSubmit={this.writeComment}>
                <textarea
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={this.handleChange}
                value={this.state.value}
                placeholder="댓글을 작성해 주세요"
                />
                <br />
                <Button block style={{marginBottom, width: '20%'}} onClick={this.writeComment}>
                    댓글 달기
                </Button>
            </form>
        </div>
    );
  }
}

export default Comment;