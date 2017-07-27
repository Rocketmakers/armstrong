// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col } from 'armstrong-react';

export class Typography extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1><Link to="/addons/">Addons:</Link> Typography</h1>

            <p>The default Armstrong should work functionally, and in many cases this will be fine for your needs. If you want a quickstart project with some custom defaults for margins, line-heights, font-sizes etc then try our typography extra.</p>

            <h2 id="installation">Installation:</h2>

            <p>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">armstrong-react-addons repo</a>, download <code>typography.scss</code>, add it to your <code>app/theme/</code> folder and then add the following to your <code>app/theme/theme.scss</code> file:</p>

            <pre className="callout major">
              @import "path/to/typography";
            </pre>

            <h2 id="howItWorks">How it works:</h2>

            <p>Will be automatically applied to standard html elements.</p>

            <h2 id="examples">Examples:</h2>

            <Grid className="typography-examples">
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>h1</code></Col>
               <Col verticalAlignment="bottom"><h1>Heading 1</h1></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>h2</code></Col>
               <Col verticalAlignment="bottom"><h2>Heading 2</h2></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>h3</code></Col>
               <Col verticalAlignment="bottom"><h3>Heading 3</h3></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>h4</code></Col>
               <Col verticalAlignment="bottom"><h4>Heading 4</h4></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>h5</code></Col>
               <Col verticalAlignment="bottom"><h5>Heading 5</h5></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>h6</code></Col>
               <Col verticalAlignment="bottom"><h6>Heading 6</h6></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code>p</code></Col>
               <Col verticalAlignment="bottom"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consequuntur perferendis consectetur minus dolores molestiae repellat consequatur provident, dolore quaerat quia nesciunt nihil optio quod esse nemo vero explicabo soluta.</p></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">b</code> <code>strong</code></Col>
               <Col verticalAlignment="bottom"><p><b>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consequuntur perferendis consectetur minus dolores molestiae repellat consequatur provident, dolore quaerat quia nesciunt nihil optio quod esse nemo vero explicabo soluta.</b></p></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">a</code></Col>
               <Col verticalAlignment="bottom"><p>Lorem ipsum dolor sit amet, <a href="#">consectetur adipisicing elit</a>.</p></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">code</code></Col>
               <Col verticalAlignment="bottom"><code>Lorem ipsum dolor sit amet.</code></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">pre</code></Col>
               <Col verticalAlignment="bottom"><pre>Lorem ipsum dolor sit amet.</pre></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">blockquote</code></Col>
               <Col verticalAlignment="bottom"><blockquote>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda repellendus, odio, sequi enim commodi reiciendis ducimus, qui eligendi similique ex obcaecati corporis aliquid eius odit.</blockquote></Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">ul</code> <code>li</code></Col>
               <Col verticalAlignment="bottom">
               <ul>
               <li>Lorem ipsum dolor sit amet</li>
               <li>Consectetur adipisicing elit. Ab veniam id blanditiis placeat</li>
               <li>Eaque asperiores similique, illum optio, quos alias quae vel porro hic nulla consectetur cum, eius accusantium iure rerum fuga ipsa laborum nam. Dignissimos quibusdam adipisci excepturi perferendis molestias magni atque hic, temporibus expedita aspernatur. Temporibus rem, nulla culpa, provident reiciendis molestiae nesciunt?</li>
               </ul>
               </Col>
             </Row>
             <Row>
               <Col verticalAlignment="bottom" width={150}><code className="m-right-small">ol</code> <code>li</code></Col>
               <Col verticalAlignment="bottom">
               <ol>
               <li>Lorem ipsum dolor sit amet</li>
               <li>Consectetur adipisicing elit. Ab veniam id blanditiis placeat</li>
               <li>Eaque asperiores similique, illum optio, quos alias quae vel porro hic nulla consectetur cum, eius accusantium iure rerum fuga ipsa laborum nam. Dignissimos quibusdam adipisci excepturi perferendis molestias magni atque hic, temporibus expedita aspernatur. Temporibus rem, nulla culpa, provident reiciendis molestiae nesciunt?</li>
               </ol>
               </Col>
             </Row>
            </Grid>
</article>
          </Col>

<Col className="secondary-nav" width={200}>
          
          <ul>
          <li><a href="#installation">Installation</a></li>
          <li><a href="#howItWorks">How it works</a></li>
          <li><a href="#examples">Examples</a></li>
          </ul>
          
          </Col>

        </Row>
      </Grid >


    );
  }
}
