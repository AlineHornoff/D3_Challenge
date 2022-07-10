// Function used to update x-scale const when clicking axis label
function xScale(csvData, chosenXAxis) {

    // Create Scale
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(csvData, d = d[chosenXAxis]) * 0.9,
        d3.max(csvData, d =>[chosenXAxis]) * 1.1
        ])
        .range([0, width]);

    return xLinearScale;
}

// Function used to update y-scale const when clicking axis label
function yScale(csvData, chosenYAxis) {

    // Create Scale
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d[chosenYAxis]) - 1,
        d3.max(csvData, d => d[chosenYAxis]) + 1
        ])
        .range([height, 0])
    
    return yLinearScale;
}

// Function used to update xAxis const upon click on axis label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// Function used to update xyxis const upon click on axis label
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// Functions to update circles group including transition to new circles for X and y coordinates
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Functions to update circles text including transition to new circles for X and y coordinates
function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Format number to AUD currency
let formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
});

// Function to update circles group with new tooltip
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

    let xpercentsign = "";
    let xlabel = "";
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty";
        xpercentsign = "%";
    }

    else if (chosenXAxis === "age") {
        xlabel = "Age";
    }

    else {
        xlabel = "Income";
    }

    let ypercentsign = "";
    let ylabel = "";
    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare";
        ypercentsign = "%";
    }

    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes";
        ypercentsign = "%";
    }

    else {
        ylabel = "Obeseity";
        ypercentsign = "%";
    }

    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([50, 75])
        .html(function(d) {
            if (chosenXAxis === "income") {
                let incomelevel = formatter(d[chosenXAxis]);

                return(`${d.state}<br>${xlabel}: ${incomelevel.substring(0,.length-3)} ${xpercentsign} <br> ${ylabel}: ${d[chosenXAxis]} ${ypercentsign}`)
            }

            else {
                return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
            };
        });
    
    circlesGroup.call(toolTip);

    // Mouseover event
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // Mouseout event
    .on("mouseout", function(data){
        toolTip.hide(data, this);
    });

return circlesGroup;    
}
