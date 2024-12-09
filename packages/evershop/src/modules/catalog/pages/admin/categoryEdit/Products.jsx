import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from 'urql';
import { Card } from '@components/admin/cms/Card';
import { useModal } from '@components/common/modal/useModal';
import './Products.scss';
import AddProducts from '@components/admin/catalog/collection/collectionEdit/AddProducts';
import Spinner from '@components/common/Spinner';

const ProductsQuery = `
  query Query ($id: Int, $filters: [FilterInput!]) {
    category (id: $id) {
      products (filters: $filters) {
        items {
          productId
          uuid
          name
          sku
          price {
            regular {
              text
            }
          }
          image {
            url: thumb
          }
          editUrl
          removeFromCategoryUrl
        }
        total
      }
    }
  }
`;

export default function Products({ category: { categoryId, addProductApi } }) {
  const [keyword, setKeyword] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [removing, setRemoving] = React.useState([]);
  const modal = useModal();

  // Run query again when page changes
  const [result, reexecuteQuery] = useQuery({
    query: ProductsQuery,
    variables: {
      id: parseInt(categoryId, 10),
      filters: !keyword
        ? [
            { key: 'page', operation: 'eq', value: page.toString() },
            { key: 'limit', operation: 'eq', value: '10' }
          ]
        : [
            { key: 'page', operation: 'eq', value: page.toString() },
            { key: 'limit', operation: 'eq', value: '10' },
            { key: 'keyword', operation: 'eq', value: keyword }
          ]
    },
    pause: true
  });

  React.useEffect(() => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, []);

  const closeModal = () => {
    // Reexecute query to update products
    reexecuteQuery({ requestPolicy: 'network-only' });
    modal.closeModal();
  };

  const removeProduct = async (api, uuid) => {
    setRemoving([...removing, uuid]);
    await fetch(api, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    });
    setPage(1);
    reexecuteQuery({ requestPolicy: 'network-only' });
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      reexecuteQuery({ requestPolicy: 'network-only' });
    }, 1500);

    return () => clearTimeout(timer);
  }, [keyword]);

  React.useEffect(() => {
    if (result.fetching) {
      return;
    }
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [page]);

  const { data, fetching, error } = result;
  if (error) {
    return (
      <p>
        Oh no...
        {error.message}
      </p>
    );
  }
  if (data || fetching) {
    return (
      <Card
        title="Products"
        actions={[
          {
            name: 'Add products',
            onAction: () => {
              modal.openModal();
            }
          }
        ]}
      >
        {modal.state.showing && (
          <div
            className={modal.className}
            onAnimationEnd={modal.onAnimationEnd}
          >
            <div
              className="modal-wrapper flex self-center justify-center items-center"
              tabIndex={-1}
              role="dialog"
            >
              <div className="modal">
                <AddProducts
                  addProductApi={addProductApi}
                  closeModal={closeModal}
                  addedProductIDs={data.category.products.items.map(
                    (p) => p.productId
                  )}
                />
              </div>
            </div>
          </div>
        )}
        <Card.Session>
          <div>
            <div className="border rounded border-divider mb-8">
              <input
                type="text"
                value={keyword}
                placeholder="Search products"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            {data && (
              <>
                {data.category.products.items.length === 0 && (
                  <div>No product to display.</div>
                )}
                <div className="flex justify-between">
                  <div>
                    <i>{data.category.products.total} items</i>
                  </div>
                  <div>
                    {data.category.products.total > 10 && (
                      <div className="flex justify-between gap-4">
                        {page > 1 && (
                          <a
                            className="text-interactive"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(page - 1);
                            }}
                          >
                            Previous
                          </a>
                        )}
                        {page < data.category.products.total / 10 && (
                          <a
                            className="text-interactive"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(page + 1);
                            }}
                          >
                            Next
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="divide-y">
                  {data.category.products.items.map((p) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div
                      key={p.uuid}
                      className="grid grid-cols-8 gap-8 py-4 border-divider items-center"
                    >
                      <div className="grid-thumbnail text-border border border-divider p-3 rounded flex justify-center col-span-1">
                        {p.image?.url && (
                          <img
                            className="self-center"
                            src={p.image?.url}
                            alt=""
                          />
                        )}
                        {!p.image?.url && (
                          <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 278.36 275.74"
                          width="100"
                          height="100"
                        >
                          <defs>
                            <style>{`.cls-1{fill:#ea5152;}.cls-1,.cls-2,.cls-3,.cls-4{stroke-width:0px;}.cls-2,.cls-5{fill:none;}.cls-6{clip-path:url(#clippath);}.cls-3{fill:#ea4f51;}.cls-4{fill:#ef7e7f;}.cls-5{stroke:#f0f1f0;stroke-miterlimit:10;stroke-width:1.89px;}`}</style>
                            <clipPath id="clippath">
                              <rect className="cls-2" x="-438.31" y="-246.79" width="390.62" height="168.6" transform="translate(-486 -324.98) rotate(-180)" />
                            </clipPath>
                          </defs>
                          <g>
                            <g>
                              <path className="cls-4" d="M201.41,136.92l-22.67,23.14-2.11,2.16v-43.46l-12.17,12.18-.48,44.29-17.37,17.27-1.97,1.96-19.34-19.7v-43.57l-10.32-10.12-2.1-2.06-.11,39.19v3.91s-26.75-26.62-26.75-26.62l.39-.21c1.34,1.79,3.47,2.95,5.88,2.95.14,0,.27,0,.41,0,2.17-.12,4.1-1.19,5.37-2.79.98-1.25,1.57-2.83,1.57-4.54l.02-2.52.1-.05v-41.43l2.1,2.12,36.46,36.81v40.6l6.68,6.45,1.94-1.97,4.27-4.36v-40.72l38.57-38.92v40.95l.1.04.02,3.01c0,4.05,3.29,7.34,7.34,7.34,1.55,0,2.99-.49,4.18-1.31Z"/>
                              <polygon className="cls-4" points="135.57 136.52 158.62 136.52 158.62 146.76 135.57 147.21 135.57 136.52"/>
                              <polygon className="cls-4" points="168.35 101.53 146.62 91.79 142.71 81.28 144.93 82.28 163.91 90.78 168.12 100.96 168.35 101.53"/>
                              <polygon className="cls-4" points="167.16 103.03 156.89 106.77 156.22 107.02 134.9 97.83 145.29 93.61 147.72 94.65 167.16 103.03"/>
                            </g>
                            <g>
                              <polygon className="cls-1" points="159.05 134.58 159.05 144.82 158.62 144.83 153.32 144.93 151.21 144.97 140.42 145.19 138.32 145.23 136.01 145.28 136.01 134.58 159.05 134.58"/>
                              <path className="cls-1" d="M178.75,116.95l-2.11,2.11-10.07,10.06-.48,44.3-19.34,19.22-.14-.14-19.21-19.56v-43.58l-12.41-12.18v3.89s-.12,39.22-.12,39.22l-2.1-2.09-20.07-19.98-4.58-4.56.39-.21c1.34,1.8,3.47,2.95,5.88,2.95,1.34,0,2.59-.36,3.67-.98,2.2-1.27,3.67-3.65,3.67-6.36,0-.81.25-1.19.02-1.93l.1-.64v-41.42l38.57,38.92v40.6l6.52,6.3.16.15,6.22-6.33v-40.72l36.46-36.8,2.1-2.12v40.95l.1.03.02,3.01c0,4.05,3.29,7.34,7.34,7.34,1.56,0,2.99-.48,4.19-1.31l-24.78,25.3v-43.45Z"/>
                              <polygon className="cls-1" points="170.36 101.97 168.12 100.96 148.63 92.23 144.93 82.28 144.73 81.72 165.91 91.22 170.36 101.97"/>
                              <polygon className="cls-1" points="170.22 103.82 159.29 107.81 156.89 106.77 137.97 98.61 147.72 94.65 148.36 94.39 170.22 103.82"/>
                            </g>
                          </g>
                        </svg>
                        )}
                      </div>
                      <div className="col-span-5">
                        <a
                          href={p.editUrl || ''}
                          className="font-semibold hover:underline"
                        >
                          {p.name}
                        </a>
                      </div>
                      <div className="col-span-2 text-right">
                        <a
                          href="#"
                          onClick={async (e) => {
                            e.preventDefault();
                            await removeProduct(
                              p.removeFromCategoryUrl,
                              p.uuid
                            );
                          }}
                          className="text-critical hover:first-letter:"
                        >
                          Remove
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {fetching && (
              <div className="p-3 border border-divider rounded flex justify-center items-center">
                <Spinner width={25} height={25} />
              </div>
            )}
          </div>
        </Card.Session>
      </Card>
    );
  } else {
    return null;
  }
}

Products.propTypes = {
  category: PropTypes.shape({
    categoryId: PropTypes.string,
    addProductApi: PropTypes.string
  }).isRequired
};

export const layout = {
  areaId: 'leftSide',
  sortOrder: 15
};

export const query = `
  query Query {
    category(id: getContextValue("categoryId", null)) {
      categoryId
      addProductApi: addProductUrl
    }
  }
`;
