import axios from "axios";
import {
  Container,
  Button,
  Table,
  Form,
  FloatingLabel,
  Row,
  Col,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
      },
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  reloadData() {
    axios.get("http://localhost:3004/data-karyawan").then((res) =>
      this.setState({
        dataApi: res.data,
        edit: false,
      })
    );
  }

  inputChange(e) {
    let newdataPost = { ...this.state.dataPost };
    if (this.state.edit === false) {
      newdataPost["id"] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;

    this.setState({
      dataPost: newdataPost,
    });
  }

  onSubmitForm = () => {
    if (this.state.edit === false) {
      axios
        .post("http://localhost:3004/data-karyawan", this.state.dataPost)
        .then(() => {
          if (window.confirm("Apakah Data Yang Diisi Sudah Benar?") === true) {
            this.reloadData();
            this.clearData();
          }
        });
    } else {
      axios
        .put(
          `http://localhost:3004/data-karyawan/${this.state.dataPost.id}`,
          this.state.dataPost
        )
        .then(() => {
          if (
            window.confirm("Apakah Data Yang Di Ubah Sudah Benar?") === true
          ) {
            this.reloadData();
            this.clearData();
          }
        });
    }
  };

  clearData = () => {
    let newdataPost = { ...this.state.dataPost };
    newdataPost["id"] = "";
    newdataPost["nama_karyawan"] = "";
    newdataPost["jabatan"] = "";
    newdataPost["jenis_kelamin"] = "";
    newdataPost["tanggal_lahir"] = "";
    this.setState({
      dataPost: newdataPost,
    });
  };

  getDataId = (e) => {
    axios
      .get(`http://localhost:3004/data-karyawan/${e.target.value}`)
      .then((res) =>
        this.setState({
          dataPost: res.data,
          edit: true,
        })
      );
  };

  handleRemove(e) {
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, {
      method: "DELETE",
    }).then((res) => this.reloadData(res));
  }

  componentDidMount() {
    this.reloadData();
  }

  render() {
    return (
      <div>
        <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <img
              src="https://freepikpsd.com/file/2019/10/admin-png-Transparent-Images.png"
              width={25}
              height={25}
              alt="Logo"
            />
            Admin Panel
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#DataKaryawan" active>Data Karyawan</Nav.Link>
            <Nav.Link href="#data2" disabled>
              Data Barang
            </Nav.Link>
            <Nav.Link href="#data3" disabled>
              Data Kendaraan
            </Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href="#user-admin/settings">
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Item href="#user-admin/log-out">
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
        <br />
        <Container style={{backgroundColor: "gray", position: "sticky", top: 0}}>
          <div>
          <h2>Input Data Karyawan</h2>
          <Form>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Nama Karyawan"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="nama_karyawan"
                    value={this.state.dataPost.nama_karyawan}
                    onChange={this.inputChange}
                    placeholder="Nama Karyawan"
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel controlId="floatingInput" label="Jabatan">
                  <Form.Control
                    type="text"
                    name="jabatan"
                    placeholder="Jabatan"
                    value={this.state.dataPost.jabatan}
                    onChange={this.inputChange}
                  />
                </FloatingLabel>
              </Col>
              <Col>
              <FloatingLabel controlId="floatingInput" label="Jenis Kelamin">
                  <Form.Control
                    type="text"
                    name="jenis_kelamin"
                    placeholder="Jenis Kelamin"
                    value={this.state.dataPost.jenis_kelamin}
                    onChange={this.inputChange}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel controlId="floatingDate" label="Tanggal Lahir">
                  <Form.Control
                    type="date"
                    name="tanggal_lahir"
                    placeholder="Tanggal Lahir"
                    value={this.state.dataPost.tanggal_lahir}
                    onChange={this.inputChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form>
          <Button type="submit" bg="primary" onClick={this.onSubmitForm}>
            Save Data
          </Button>
          </div>
        </Container>
        <br />
        <br />
        <div>
          <Container style={{ textAlign: "center" }}>
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Jenis Kelamin</th>
                  <th>Tanggal Lahir</th>
                  <th>Settings</th>
                </tr>
              </thead>
              <tbody>
                {this.state.dataApi.map((dat, index) => {
                  return (
                    <tr key={index}>
                      <td>{dat.nama_karyawan}</td>
                      <td>{dat.jabatan}</td>
                      <td>{dat.jenis_kelamin}</td>
                      <td>{dat.tanggal_lahir}</td>
                      <td>
                        <Button
                          value={dat.id}
                          onClick={this.getDataId}
                          variant="success"
                        >
                          Edit Data
                        </Button>{" "}
                        <Button
                          value={dat.id}
                          onClick={(e) => {
                            if (
                              window.confirm(
                                "Apakah Anda Yakin Ingin Menghapus Data Ini?"
                              ) === true
                            ) {
                              this.handleRemove(e);
                            }
                          }}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </div>
      </div>
    );
  }
}
export default App;
