// D3 Challenge
// @TODO: YOUR CODE HERE!

// 
const svgWidth = 960;
const svgHeight = 500;

//
const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

//
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group which will hold the current chart - shift by left and top margins
const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight + 40); //extra padding for third label

// Append avg group
const chartGroup = svg.append("g")
    .attr("tranform", `translate(${margin.left}, ${margin.top})`);

// Set initial parameters
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

//
(async function(){

    // Import data
    const stateData = await d3.csv("assets/data/data.csv");

    // Parse data and cast as numbers
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.income = +data.income; 
    });

    // Initialise scale functions
    let xLinearScale = xScale(stateData, chosenXAxis);
    let yLinearScale = yScale(stateData, chosenYAxis)

    // Initialise axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append x and y axis to the chart
    let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    let yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Create scatterplot and append initial circles
    let circlesGroup = chartGroup.selectAll("g circle")
        .data(stateData)
        .enter()
        .append("g");
    
    let circlesXY = circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

    let circlesText = circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenXAxis]) + 5)
        .classed("stateText", true);

    // Create group for 3 x-axis labels
    const xlabelsGroup = chartGroup.append("g")
        .attr("tansform", `translate(${width / 2}, ${height})`);

    const povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .text("In Poverty (%)")
        .classed("active", true);

    const ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age") // value to grab for event listener
        .text("Age (median)")
        .classed("inactivate", true);

    const incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "age") // value to grab for event listener
        .text("Household Income (median)")
        .classed("inactivate", true);

    // Create group for 3 y-axis labels
    const ylabelsGroup = chartGroup.append("g");

    const healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -40)
        .attr("value", "healthcare")// value to grab for event listener
        .text("Lacks Healthcare (%)")
        .classed("activate", true);

    const smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("value", "smokes")// value to grab for event listener
        .text("Smokes (%)")
        .classed("inactivate", true);

    const obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -80)
        .attr("value", "obesity")// value to grab for event listener
        .text("Obese (%)")
        .classed("inactivate", true);

    // Initial tooltips
    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function(){

            // Get value of selection
            const value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // Replace chosenXAxis with value
                chosenXAxis = value;

                // Update x scale for new data
                xLinearScale = xScale(stateData, chosenXAxis);

                // Update x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Update circles with new x value
                circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);
                
                // Update circles text with new x value
                circlesText = renderXText(circlesGroup, chosenXAxis, chosenYAxis);

                
                // Update tooltips with new info
                circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

                // Change classes to change bold text
                if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classes("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classes("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classes("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classes("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classes("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classes("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classes("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classes("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classes("inactive", true);
                }
            }
        });

        // y axis labels event listener
        ylabelsGroup.selectAll("text")
        .on("click", function(){
            // Get value of selection
            const value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // Replace chosenYAxis with value
                chosenYAxis = value;

                // Update y scale for new data
                yLinearScale = yScale(stateData, chosenYAxis);

                // Update y axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // Update circles with new y values
                circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);

                // Update circles text with new y values
                circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

                // Update tooltips with new info
                circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

                // Change classes to change bold text
                if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", ture);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", ture);
                }
                else if (chosenYAxis === "obesity") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", ture);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", ture);
                }
            }
        });
})

