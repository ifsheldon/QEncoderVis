import React, { useEffect } from 'react';
import * as d3 from 'd3';

function Link(props) {
    // dataset
    let linkComp_width = props.linkComp_width;
    let linkComp_height = props.linkComp_height;
    let linkComp_left = props.linkComp_left;
    let linkComp_top = props.linkComp_top;

    // Define new measure
    let svg_width = linkComp_width;
    let svg_height = linkComp_height;

    // Colors
    const [class_color, color_linkComp_bg] = props.colors;

    //////////////////////////////////////////////
    // Mount the component once
    useEffect(() => {
        const svg = d3.select("#linkComp");
        const lineY = svg_height / 2;
        const segmentWidth = 20; // Width of the white segment

        // Add a line
        const group = svg
            .append("g")
            .attr("class", "linkComp");

        group.append("line")
            .attr("x1", 0)
            .attr("y1", lineY)
            .attr("x2", svg_width)
            .attr("y2", lineY)
            .attr("stroke", "#343434")
            .attr("stroke-width", 2);

        // Add a triangle arrow using `path`
        const arrowSize = 10; // Size of the arrow triangle
        group.append("path")
            .attr("d", `
                M ${0} ${lineY - arrowSize} 
                L ${0} ${lineY + arrowSize} 
                L ${arrowSize-3} ${lineY} 
                Z
            `) // Draw the arrow shape
            .attr("fill", "#343434");

        const segment = group.append("rect")
            .attr("x", -segmentWidth)
            .attr("y", lineY - 4) // Centered on the line
            .attr("width", segmentWidth)
            .attr("height", 8)
            .attr("fill", "#ffffff");



        // Animation loop with constant speed
        function animateSegment() {
            const totalDuration = 300; // Total duration for the segment to move across the line

            function loop() {
                segment
                    .attr("x", -segmentWidth)
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(totalDuration)
                    .attr("x", svg_width)
                    .on("end", loop); // Repeat the animation
            }

            loop(); // Start the animation loop
        }

        animateSegment();

    }, [linkComp_width, linkComp_height]);

    //////////////////////////////////////////////

    return (
        <div
            className={'component linkComp'}
            style={{width: linkComp_width, height: linkComp_height, left: linkComp_left, top: linkComp_top,}}
        >
            <svg id={'linkComp'} width={linkComp_width} height={linkComp_height} style={{ marginTop: '10px' }}>
                <rect
                    x={0}
                    y={0}
                    width={linkComp_width}
                    height={linkComp_height}
                    fill={color_linkComp_bg}
                    rx="10"
                    ry="10"
                />
            </svg>
        </div>
    );
}

export default Link;
