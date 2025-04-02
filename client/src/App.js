import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3'
import axios from 'axios'
import './App.css';
import { Switch, Layout, Form, Button, Input, InputNumber, Slider, Spin, Select, Row, Col, Progress, Drawer, Avatar, List } from 'antd';
import { RightOutlined, PauseOutlined, ReloadOutlined, PlayCircleFilled } from '@ant-design/icons';




import P1 from "./Articles/p1";
import Footer from "./Articles/footer";
import Top from "./Articles/top";

import Comp1 from "./Components/comp1";
import Comp2 from "./Components/comp2";
import Comp3 from "./Components/comp3";
import Comp4 from "./Components/comp4";
import Comp5 from "./Components/comp5";
import Comp6 from "./Components/comp6";
import Comp7 from "./Components/comp7";
import Link from "./Components/link";
import DescriptionComp from "./Components/description";





// 布局参数
let  vis_width = 1060
let  vis_height = vis_width*0.525

let control_width = vis_width
let control_height = vis_width*0.1

let comp1_width = vis_width*0.23
let comp1_height = vis_width*0.26
let comp1_left = vis_width*0.04, comp1_top = vis_width*0.023

let comp2_width = vis_width*0.19
let comp2_height = vis_width*0.133
let comp2_left = vis_width*0.038, comp2_top = vis_width*0.34



let comp3_width = vis_width*0.45
let comp3_height = vis_width*0.07
let comp3_left = vis_width*0.29, comp3_top = vis_width*0.023


let comp4_width = vis_width*0.4
let comp4_height = vis_width*0.295
let comp4_left = vis_width*0.720, comp4_top = vis_width*0.023

let linkComp_width = comp3_left-(comp1_left+comp1_width) + comp3_width+40
let linkComp_height = vis_width*0.07
let linkComp_left = comp1_width-20, linkComp_top = comp3_top+comp3_height+10


let comp5_width = vis_width*0.54
let comp5_height = vis_width*0.2
let comp5_left = vis_width*0.565, comp5_top = vis_width*0.34



let comp6_width = vis_width*0.45
let comp6_height = vis_width*0.25
let comp6_left = comp3_left, comp6_top = comp3_top+comp3_height+10


let comp7_width = vis_width*0.28
let comp7_height = vis_width*0.145
let comp7_left = vis_width*0.26, comp7_top = vis_width*0.34


let descriptionComp_width = vis_width
let descriptionComp_height = vis_height
let descriptionComp_left = 0, descriptionComp_top = 0








let article_width = 650
let centered_footer_bgColor = 650






// All color setting here
// define colors here
let color_class1 = '#ffe682'
let color_class2 = '#006962'
let color_class1 = '#eebc6f'
let color_class2 = '#6fc6be'
let color_class1 = '#114057'
let color_class2 = '#fde625'
let color_class1 = '#f65262'
let color_class2 = '#4f7cff'
let color_class1 = '#80ee02'
let color_class2 = '#750d0d'
let top_bg_color = '#183D4E'
let centered_control_color = '#ffffff'
let container_control_color = '#ffffff'
let centered_vis_color = '#fafafa'
let container_vis_color = '#fafafa'
let play_btn_color = '#2c2c2c'
let progress_color = "#545454"
let centered_article_bgColor = '#ffeeff'
let color_comp2_bg = '#ececec'
let color_comp3_bg = '#ececec'
let color_comp4_bg = '#f1f1f1'
let color_comp5_bg = '#f9f9f9'
let color_comp6_bg = '#f9f9f9'
let color_comp7_bg = '#ececec'
let color_linkComp_bg = '#fafafa'


// dataset and backend port API
let data_port_map = {
    'circuit_0': 'run_circuit_0',
    'circuit_1': 'run_circuit_1',
    'circuit_2': 'run_circuit_2',
    'circuit_3': 'run_circuit_3',
    'circuit_4': 'run_circuit_4',
    'circuit_5': 'run_circuit_5',

    'circuit_21': 'run_circuit_21',

}






function App() {



    let default_circuit = 'circuit_5'
    let [data_name, set_dataName] = useState(default_circuit)
    let [dataset, setDataset] = useState(null);


    let [drawer_open, set_drawer_open] = useState(false)
    let [comp6Loading, setComp6Loading] = useState(true);



    const handleDatasetClick = (datasetName) => {
        set_dataName(datasetName);
    };



    /*设置抽屉的状态的函数*/
    const showDrawer = () => {
        set_drawer_open(true);
    };

    const onClose = () => {
        set_drawer_open(false);
    };

  //////////////////////////////////////////////

  // mount 的时候渲染一次
    useEffect(() => {

        let port_name = data_port_map[data_name]

        let request_url = `http://127.0.0.1:3030/api/${port_name}`




        const fetchData = async () => {
            const result = await axios.get(request_url);
            console.log(`'App.js' - Dataset (${data_name}) loaded. `, result.data)

            setDataset(result.data)

        };


        fetchData();

    }, [data_name])



    // useEffect(() => {
    //
    //     setTimeout(() => {
    //         setComp6Loading(false);
    //     }, 1500); // Delay for 1.5 seconds
    //
    // }, [dataset])





  return (
      <Layout style={{ height:'100%',
          width: '100%',
          backgroundColor:'#ffffff', /* *** */
          position:'relative',
      }}>



          {/* the top board component */}
          <Top top_bg_color={top_bg_color}></Top>



          {/* GUI for vis interface */}
          <div className={'container-for-centered'}
               style={{backgroundColor:container_control_color/* *** */}}>
              <div id={'control'}
                   className={'centered'}
                   style={{
                       height: control_height,
                       width: control_width,
                       backgroundColor:centered_control_color, /* *** */
                       padding: '1.5em'
                   }}>




                  <div style={{marginTop:'10px', marginLeft:'1.4em'}}>
                      <span className={'control_font'}>Specify encoder</span>
                      <Row
                          style={{width: '180px', marginTop:'5px'}}>
                          <Col span={16}>
                              <Select
                                  // showArrow={'false'}
                                  mode="multiple"
                                  style={{
                                      width: '100%',
                                      height: "32px"
                                  }}
                                  size={'small'}
                                  placeholder="Select an encoder"
                                  defaultValue={['(RX+RX)-(RY+RY)-(RY+RY)-(CNOT)']}
                                  // onChange={handleChange}
                                  // options={options}
                              />
                          </Col>
                          <Col>
                              <Button style={{width: '100%', marginLeft: '0.2em', height: "32px"}}
                                      onClick={showDrawer}
                                      size={'small'}

                              >
                                  <RightOutlined />
                              </Button>
                              <Drawer
                                  title="Basic Drawer"
                                  placement="right"
                                  closable={false}
                                  onClose={onClose}
                                  open={drawer_open}
                              >
                                  {/*抽屉里面的内容*/}
                                  <List
                                      dataSource={[
                                          {
                                              id: 1,
                                              name: 'Lily',
                                          },
                                          {
                                              id: 2,
                                              name: 'Lily',
                                          },
                                      ]}
                                      bordered
                                      renderItem={(item) => (
                                          <List.Item
                                              key={item.id}
                                              actions={[
                                                  <a onClick={showDrawer} key={`a-${item.id}`}>
                                                      View Profile
                                                  </a>,
                                              ]}
                                          >
                                              <List.Item.Meta
                                                  avatar={
                                                      <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                                                  }
                                                  title={<a href="https://ant.design/index-cn">{item.name}</a>}
                                                  description="Progresser XTech"
                                              />
                                          </List.Item>
                                      )}
                                  />
                                  <div className={'drawer_button_group'}>
                                      <Button
                                          style={{marginRight: 8, display: 'inline'}}
                                          // onClick={this.onClose}
                                      >
                                          Cancel
                                      </Button>
                                      <Button  type="primary"
                                          // onClick={this.onClose}
                                      >
                                          Submit
                                      </Button>
                                  </div>
                              </Drawer>
                          </Col>
                      </Row>

                  </div>




                  <div style={{marginTop:'10px', marginRight: '1.5em'}}>
                      <span className={'control_font'}>Training epoch</span>
                      <Progress percent={100}
                                status="active"
                                strokeColor={progress_color}
                                style={{width: '150px', marginRight:'-30px', marginTop:'5px'}}
                      />
                  </div>




                  <div className="button-group">
                      <Button icon={<span className="material-symbols-outlined"  style={{fontSize:'2em'}}>timer_pause</span>} type="text"/>
                      <Button className={"play-button"} style={{color: play_btn_color, marginLeft:'2em', marginRight:'2em'}} icon={<PlayCircleFilled  style={{fontSize: '4.5em'}}/>} type="text"/>
                      <Button icon={<span className="material-icons" style={{fontSize:'2em'}}>replay</span>}  type="text"/>
                  </div>






                  <div style={{marginTop:'10px'}}>
                      <span className={'control_font'}>Epoch number</span>
                      <Form.Item style={{width: '200px', marginRight:'-30px', marginTop:'5px'}}>
                          <Row>
                              <Col span={14}>
                                  <Slider
                                      min={0}
                                      max={1000}
                                      step={100}
                                      value={100}
                                      // onAfterChange={this.view2_gate_qual_filter}
                                      // disabled={check1()}
                                  />
                              </Col>
                              <Col>
                                  <InputNumber
                                      style={{width: '40px'}}
                                      size={'small'}
                                      value={100}
                                      controls={false}
                                  />
                              </Col>
                          </Row>
                      </Form.Item>
                  </div>

                  <div style={{marginTop:'10px', marginRight: '1em'}}>
                      <span className={'control_font'}>Learning rate</span>
                      <Form.Item style={{width: '200px', marginRight:'-30px', marginTop:'5px'}}>
                          <Row>
                              <Col span={14}>
                                  <Slider
                                      min={0}
                                      max={0.1}
                                      step={0.01}
                                      value={0.02}
                                      // onAfterChange={this.view2_gate_qual_filter}
                                      // disabled={check1()}
                                  />
                              </Col>
                              <Col>
                                  <InputNumber
                                      style={{width: '40px'}}
                                      size={'small'}
                                      value={0.02}
                                      controls={false}
                                  />
                              </Col>
                          </Row>
                      </Form.Item>
                  </div>

              </div>
          </div>



          {/* vis interface*/}
          <div className={'container-for-centered'}
              style={{backgroundColor:container_vis_color/* *** */}}>
              <div id={'vis_system'}
                   style={{
                       height: vis_height,
                       width: vis_width,
                       backgroundColor:centered_vis_color, /* *** */
                   }}>


                  {/* Component-1: original data view*/}
                  {dataset? (
                      <Comp1
                          dataset={dataset['original_data']}
                          class_color={[color_class1, color_class2]}
                          comp1_width={comp1_width}
                          comp1_height={comp1_height}
                          comp1_left={comp1_left}
                          comp1_top={comp1_top}
                      ></Comp1>):(
                          <Spin fullscreen={true} tip="Loading" className={'spin-comp1'} size="large" />
                  )}




                  {/* Component-2: data selector panel*/}
                  {dataset? (
                    <Comp2
                        dataset={dataset['original_data']}
                        vis_width={vis_width}
                        default_circuit={default_circuit}
                        onDatasetClick={handleDatasetClick}
                        colors={[[color_class1, color_class2], color_comp2_bg]}
                        comp2_width={comp2_width}
                        comp2_height={comp2_height}
                        comp2_left={comp2_left}
                        comp2_top={comp2_top}
                        vis_width={vis_width}></Comp2>

                  ):( <></>)}


                  {/* Component-3: quantum circuit show*/}
                  {dataset? (
                  <Comp3
                      dataset={dataset['circuit']}
                      comp3_width={comp3_width}
                      comp3_height={comp3_height}
                      comp3_left={comp3_left}
                      comp3_top={comp3_top}
                      color_comp3_bg={color_comp3_bg}
                  ></Comp3>
                  ):(<></>)}



                  {/* Component-4: encoded map*/}
                  {dataset? (
                      <Comp4
                          dataset={dataset['encoded_data']}
                          boundary={dataset['boundary']}
                          colors={[[color_class1, color_class2], color_comp4_bg]}
                          comp4_width={comp4_width}
                          comp4_height={comp4_height}
                          comp4_left={comp4_left}
                          comp4_top={comp4_top}
                      ></Comp4>
                  ):(<></>)}



                  {/* Link: animated line from Comp1 to Comp4*/}
                  {dataset? (
                      <Link
                          // dataset={dataset['encoded_data']}
                          boundary={null}
                          colors={[[color_class1, color_class2], color_linkComp_bg]}
                          linkComp_width={linkComp_width}
                          linkComp_height={linkComp_height}
                          linkComp_left={linkComp_left}
                          linkComp_top={linkComp_top}
                      ></Link>
                  ):(<></>)}




                  {/* Component-5: Model performance view*/}
                  {dataset? (
                      <Comp5
                          dataset1={dataset['performance']}
                          dataset2={dataset['trained_data']}
                          colors={[[color_class1, color_class2], color_comp5_bg]}
                          comp5_width={comp5_width}
                          comp5_height={comp5_height}
                          comp5_left={comp5_left}
                          comp5_top={comp5_top}
                      ></Comp5>
                  ):(<></>)}



                  {/* Component-6: encoder step map*/}
                  {dataset? (
                      <Comp6
                          dataset={[dataset['encoded_steps'], dataset['encoded_steps_sub']]}
                          comp6_width={comp6_width}
                          comp6_height={comp6_height}
                          comp6_left={comp6_left}
                          comp6_top={comp6_top}
                          colors={[[color_class1, color_class2], color_comp6_bg]}
                      ></Comp6>
                  ):(<></>)}




                  {/* Component-7: Quantum state distribution*/}
                  {dataset? (
                      <Comp7
                          dataset={dataset['distribution_map']}
                          comp7_width={comp7_width}
                          comp7_height={comp7_height}
                          comp7_left={comp7_left}
                          comp7_top={comp7_top}
                          colors={[[color_class1, color_class2], color_comp7_bg]}
                      ></Comp7>
                  ):(<></>)}



                  {/* Component-descriptionComp: some description*/}
                  {dataset? (
                      <DescriptionComp
                          // dataset={dataset['encoded_steps']}
                          descriptionComp_width={descriptionComp_width}
                          descriptionComp_height={descriptionComp_height}
                          descriptionComp_left={descriptionComp_left}
                          descriptionComp_top={descriptionComp_top}
                          // colors={[[color_class1, color_class2], color_comp7_bg]}
                      ></DescriptionComp>
                  ):(<></>)}








              </div>
          </div>




          {/*article after the vis view*/}
          <article>
              <div className="article-body" style={{width: article_width, background:centered_article_bgColor}}>
                    <P1></P1> {/*Article here*/}
              </div>
          </article>


          {/* footer*/}
          <footer>
              <div className="centered-footer" style={{width: article_width, background:centered_footer_bgColor}}>
                <Footer></Footer>
              </div>
          </footer>




      </Layout>
    );
}

export default App;