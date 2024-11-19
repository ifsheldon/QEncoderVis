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
import Comp3 from "./Components/comp3";
import Comp4 from "./Components/comp4";
import Comp5 from "./Components/comp5";

import Module_draw_2dplot from "./Functions/module_draw_2dplot";




// 布局参数
let  vis_width = 1060
let  vis_height = vis_width*0.5

let control_width = vis_width
let control_height = vis_width*0.1

let comp1_width = vis_width*0.23
let comp1_height = vis_width*0.26
let comp1_left = vis_width*0.04, comp1_top = vis_width*0.023

let comp2_width = vis_width*0.19
let comp2_height = vis_width*0.133
let comp2_left = vis_width*0.038, comp2_top = vis_width*0.3
let comp2_paddingLeft = vis_width*0.01
let comp2_paddingTop = vis_width*0.01
let comp2_dataOption_distanceX = vis_width*0.059
let comp2_dataOption_distanceY = vis_width*0.06


let comp3_width = vis_width*0.45
let comp3_height = vis_width*0.08
let comp3_left = vis_width*0.27, comp3_top = vis_width*0.023


let comp4_width = vis_width*0.4
let comp4_height = vis_width*0.4
let comp4_left = vis_width*0.720, comp4_top = vis_width*0.023


let comp5_width = vis_width*0.3
let comp5_height = vis_width*0.18
let comp5_left = vis_width*0.720, comp5_top = vis_width*0.33





let article_width = 650
let centered_footer_bgColor = 650






// All color setting here
// define colors here
let color_class1 = '#eebc6f'
let color_class2 = '#6fc6be'
let top_bg_color = '#183D4E'
let centered_control_color = '#ffffff'
let container_control_color = '#ecf8ea'
let centered_vis_color = '#f9f9f9'
let container_vis_color = '#ffeeee'
let play_btn_color = '#2c2c2c'
let progress_color = "#545454"
let centered_article_bgColor = '#ffeeff'
let color_comp2_bg = '#f1f1f1'
let color_comp3_bg = '#f1f1f1'
let color_comp4_bg = '#f1f1f1'
let color_comp5_bg = '#f1f1f1'






function App() {


    const [dataset, setData] = useState(null);


    const [selectedDataOption, setSelectedDataOption] = useState(0);  // State to track the selected module
    let [drawer_open, set_drawer_open] = useState(false)




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
        const fetchData = async () => {
            const result = await axios.get('http://127.0.0.1:3030/api/run_Jiang_dataset');
            console.log(`'App.js' - Dataset loaded. `, result.data)
            setData(result.data);
        };

        fetchData();

    }, [])





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
                                  defaultValue={['a10']}
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
                      <Progress percent={50}
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
                                      min={1}
                                      max={20}
                                      step={1}
                                      defaultValue={7}
                                      // onAfterChange={this.view2_gate_qual_filter}
                                      // disabled={check1()}
                                  />
                              </Col>
                              <Col>
                                  <InputNumber
                                      style={{width: '40px'}}
                                      size={'small'}
                                      // value={this.state.view2_gate_qual_filter[1]}
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
                                      min={1}
                                      max={20}
                                      step={1}
                                      defaultValue={7}
                                      // min={this.state.view2_qual_extent[0]}
                                      // max={this.state.view2_qual_extent[1]}
                                      // onAfterChange={this.view2_gate_qual_filter}
                                      // disabled={check1()}
                                  />
                              </Col>
                              <Col span={7}>
                                  <InputNumber
                                      style={{width: '40px'}}
                                      size={'small'}
                                      // value={this.state.view2_gate_qual_filter[1]}
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
                      //<div className="loading-overlay">
                          <Spin fullscreen={true} tip="Loading" className={'spin-comp1'} size="large" />
                      //</div>
                  )}




                  {/* Component-2: data selector panel*/}
                  {dataset? (

                      <div  className={'component'}
                            style={{width: comp2_width, height:comp2_height, left:comp2_left, top: comp2_top}}>
                          <span className="comp_title">Data Selector</span>

                          {/*svg for one data selector*/}
                          <svg id="comp1_data_selector" width={comp2_width} height={comp2_height} style={{ marginTop: '10px' }}>
                              <rect x={0} y={0} width={comp2_width} height={comp2_height} fill={color_comp2_bg} rx="10" ry="10" />

                              <g transform={`translate(${comp2_paddingLeft}, ${comp2_paddingTop})`}>
                                  {/* Iteration to generate 6 option datasets in a 2x3 grid */}
                                  {Array.from({ length: 6 }, (_, i) => {

                                      return (
                                          <g transform={`translate(${i % 3 * comp2_dataOption_distanceX+4}, ${Math.floor(i / 3) * comp2_dataOption_distanceY+4})`}
                                             className={selectedDataOption === i ? 'data-option-selected' : 'data-option-unselected'}
                                             key={i}
                                             onClick={() => setSelectedDataOption(i)}  // Set the selected module on click
                                          >

                                              <g>
                                                  <Module_draw_2dplot
                                                      dataset={dataset['original_data']}
                                                      class_color={[color_class1, color_class2]}
                                                      boundary={null}
                                                      translate={[0,0]}
                                                      request_port={'run_Jiang_dataset'}
                                                      mode={"small"}
                                                      module_name={`comp2_2dplot_${i + 1}`}
                                                  />
                                              </g>
                                              <rect
                                                  x={0}
                                                  y={0}
                                                  width={comp2_dataOption_distanceX-12}
                                                  height={comp2_dataOption_distanceY-12}
                                                  strokeWidth={2.3} // Border width
                                                  className={`data-option-border`}
                                                  rx={'2px'}
                                                  ry={'2px'}
                                              />
                                          </g>

                                      );
                                  })}
                              </g>
                          </svg>
                      </div>


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


                  {/* Component-5: Model performance view*/}
                  {dataset? (
                      <Comp5
                          dataset={dataset['performance']}
                          colors={[[color_class1, color_class2], color_comp5_bg]}
                          comp5_width={comp5_width}
                          comp5_height={comp5_height}
                          comp5_left={comp5_left}
                          comp5_top={comp5_top}
                      ></Comp5>
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